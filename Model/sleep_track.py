import cv2
import dlib
import time
import numpy as np
from imutils import face_utils

def read_last_sleep_duration(filename="Data/sleep_data.txt"):
    """Read the last recorded sleep duration from the file."""
    try:
        with open(filename, "r") as f:
            duration_str = f.read().strip()
            h, m, s = map(int, duration_str.split(":"))
            return h * 3600 + m * 60 + s  # Convert to total seconds
    except (FileNotFoundError, ValueError):
        # If file doesn't exist or is empty, return 0
        return 0

def write_sleep_duration(total_seconds, filename="Data/sleep_data.txt"):
    """Write the total sleep duration in HH:MM:SS format to the file."""
    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    duration_str = f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"
    with open(filename, "w") as f:
        f.write(duration_str)

def main():
    # Load the cumulative sleep duration from the file
    cumulative_sleep_duration = read_last_sleep_duration()

    # Initialize the face detector and facial landmark predictor
    face_detector = dlib.get_frontal_face_detector()
    landmark_predictor = dlib.shape_predictor(r'A:\Projects\Vital Monitoring\From_Scratch\shape_predictor_68_face_landmarks.dat')

    # Indices for eye landmarks in the 68-point model
    (L_EYE_START, L_EYE_END) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
    (R_EYE_START, R_EYE_END) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]

    # Calculate eye aspect ratio to check if eyes are closed
    def eye_aspect_ratio(eye):
        A = np.linalg.norm(eye[1] - eye[5])  # Vertical distance
        B = np.linalg.norm(eye[2] - eye[4])  # Vertical distance
        C = np.linalg.norm(eye[0] - eye[3])  # Horizontal distance
        ear = (A + B) / (2.0 * C)
        return ear

    # Thresholds
    EYE_CLOSED_THRESHOLD = 0.21  # Threshold for eye aspect ratio (below this indicates closed eyes)
    CONSEC_FRAMES_SLEEP = 3      # Number of consecutive frames with closed eyes indicating sleep

    # Variables to keep track of the sleep status
    closed_eyes_frames = 0
    is_asleep = False
    start_sleep_timestamp = None

    # Capture video from webcam
    cap = cv2.VideoCapture('http://127.0.0.1:8000/video_feed')

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        
        # Convert to grayscale for faster processing
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces in the frame
        faces = face_detector(gray, 0)
        
        # Loop through all detected faces
        for face in faces:
            # Predict facial landmarks
            shape = landmark_predictor(gray, face)
            shape = face_utils.shape_to_np(shape)
            
            # Extract eye regions and calculate eye aspect ratio for both eyes
            left_eye = shape[L_EYE_START:L_EYE_END]
            right_eye = shape[R_EYE_START:R_EYE_END]
            left_ear = eye_aspect_ratio(left_eye)
            right_ear = eye_aspect_ratio(right_eye)
            
            # Average the eye aspect ratios
            ear = (left_ear + right_ear) / 2.0
            
            # Check if eyes are closed
            if ear < EYE_CLOSED_THRESHOLD:
                closed_eyes_frames += 1
                if not is_asleep:
                    # Start a new sleep session if not already asleep
                    is_asleep = True
                    start_sleep_timestamp = time.time()
            else:
                # Reset frame counter if eyes are open
                closed_eyes_frames = 0
                if is_asleep:
                    # Calculate sleep session duration and add to cumulative sleep duration
                    end_sleep_time = time.time()
                    session_duration = int(end_sleep_time - start_sleep_timestamp)
                    cumulative_sleep_duration += session_duration
                    write_sleep_duration(cumulative_sleep_duration)  # Save updated duration to file
                    is_asleep = False

            # Calculate total cumulative sleep duration
            if is_asleep:
                # If currently sleeping, calculate ongoing sleep duration
                current_sleep_duration = cumulative_sleep_duration + int(time.time() - start_sleep_timestamp)
            else:
                # Otherwise, just use the recorded cumulative sleep duration
                current_sleep_duration = cumulative_sleep_duration

            # Convert cumulative sleep duration to HH:MM:SS
            hours, remainder = divmod(current_sleep_duration, 3600)
            minutes, seconds = divmod(remainder, 60)
            sleep_duration_str = f"{int(hours):02}:{int(minutes):02}:{int(seconds):02}"

            # Display sleep status and cumulative duration on the screen
            if is_asleep:
                cv2.putText(frame, "SLEEPING", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            cv2.putText(frame, f"Total Sleep Duration: {sleep_duration_str}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 255), 2)
            
            # Draw the eye contours for visual feedback
            for (x, y) in np.concatenate((left_eye, right_eye), axis=0):
                cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)
        
        # Display the frame
        cv2.imshow("Sleep Tracking", frame)
        
        # Press 'q' to exit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Final write of the cumulative sleep duration to the file
    write_sleep_duration(cumulative_sleep_duration)

    # Release the capture and close windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()

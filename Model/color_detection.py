import cv2
import numpy as np

def main():
    # Define the range of skin color in HSV
    lower_skin = np.array([0, 20, 70], dtype=np.uint8)
    upper_skin = np.array([20, 255, 255], dtype=np.uint8)

    # Load the Haar Cascade for face detection
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

    # Define color thresholds for skin tone categorization (in HSV)
    skin_tone_ranges = {
        "Fair": ([0, 20, 150], [20, 50, 255]),
        "Medium": ([0, 30, 70], [20, 255, 200]),
        "Dark": ([0, 20, 50], [20, 255, 150])
    }

    # Function to determine skin tone name
    def get_skin_tone_name(hsv_value):
        for tone, (lower, upper) in skin_tone_ranges.items():
            lower_bound = np.array(lower, dtype=np.uint8)
            upper_bound = np.array(upper, dtype=np.uint8)
            if cv2.inRange(np.uint8([[hsv_value]]), lower_bound, upper_bound):
                return tone
        return "Unknown"

    # Start capturing video from the default camera
    cap = cv2.VideoCapture('http://127.0.0.1:8000/video_feed')

    while True:
        # Read a frame from the video
        ret, frame = cap.read()
        if not ret:
            break
        
        # Convert the frame to grayscale for face detection
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        
        # Detect faces in the frame
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(50, 50))
        
        # Loop through each detected face
        for (x, y, w, h) in faces:
            # Draw a rectangle around the face
            cv2.rectangle(frame, (x, y), (x + w, y + h), (255, 0, 0), 2)
            
            # Get the face region of interest (ROI) in HSV
            face_roi = frame[y:y + h, x:x + w]
            hsv_face_roi = cv2.cvtColor(face_roi, cv2.COLOR_BGR2HSV)
            
            # Create a skin color mask within the face ROI
            mask = cv2.inRange(hsv_face_roi, lower_skin, upper_skin)
            skin = cv2.bitwise_and(face_roi, face_roi, mask=mask)
            
            # Calculate the average skin color in the face ROI
            skin_pixels = hsv_face_roi[mask > 0]  # Only skin pixels
            if skin_pixels.size > 0:
                avg_skin_hsv = np.mean(skin_pixels, axis=0)
                avg_skin_rgb = cv2.cvtColor(np.uint8([[avg_skin_hsv]]), cv2.COLOR_HSV2RGB)[0][0]
                avg_skin_bgr = cv2.cvtColor(np.uint8([[avg_skin_hsv]]), cv2.COLOR_HSV2BGR)[0][0]
                
                # Determine skin tone name
                skin_tone = get_skin_tone_name(avg_skin_hsv)
                
                # Display the average skin color as text and skin tone name
                cv2.putText(frame, f"Skin Tone: {skin_tone}", (x, y - 30), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                cv2.putText(frame, f"Skin Color (BGR): {avg_skin_bgr}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
                
                # Check if the skin color is blue-toned
                if avg_skin_hsv[0] > 90 and avg_skin_hsv[0] < 130:  # Hue range for blue
                    cv2.putText(frame, "ALERT: Unusual blue color detected!", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                
                # Continuously write the skin tone and BGR color to a file
                with open("skin_tone_data.txt", "w") as f:
                    f.write(f"Skin Tone: {skin_tone}\n")
                    f.write(f"Average Skin Color (BGR): {avg_skin_bgr.tolist()}\n")
            
            # Display the skin-detected area within the face
            frame[y:y + h, x:x + w] = cv2.addWeighted(skin, 0.5, face_roi, 0.5, 0)

        # Display the original video with face and skin detection
        cv2.imshow('Face and Skin Detection', frame)
        
        # Press 'q' to exit the loop
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    # Release the video capture and close all windows
    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    main()

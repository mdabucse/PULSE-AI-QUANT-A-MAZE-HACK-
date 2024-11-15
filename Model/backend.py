import color_detection
import heart_rate
import sleep_track
from multiprocessing import Process
import temperature
import llm_responce


# Define processes to run each module's main function
def run_in_parallel():
    process1 = Process(target=heart_rate.main)
    process2 = Process(target=color_detection.main)
    process3 = Process(target=sleep_track.main)
    process4 = Process(target=temperature.only_face)
    process5 = Process(target=llm_responce.main)

    # Start each process
    process1.start()
    process2.start()
    process3.start()
    process4.start()
    process5.start()

    # Optional: Wait for each process to finish
    process1.join()
    process2.join()
    process3.join()
    process4.join()
    process5.join()

if __name__ == "__main__":
    run_in_parallel()

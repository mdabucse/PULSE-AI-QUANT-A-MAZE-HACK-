import os
import time
from openai import OpenAI
from dotenv import load_dotenv
from langchain.prompts import PromptTemplate

def save_to_file(filename, content):
    """Save the content to a specified file."""
    with open(filename, "w") as file:
        file.write(content)

def llm_response(heart_rate, temperature, color, sleep_time):
    load_dotenv()
    api_key = os.getenv('OPENAI_API_KEY')

    client = OpenAI(api_key=api_key)

    prompt_template = '''
            Given the following data for a newborn, calculate the APGAR score based on heart rate, body temperature, color (appearance), and sleep cycle. Then provide a 2-3 line summary based on the total APGAR score.
            Heart Rate: {heart_rate}
            Temperature: {temperature}
            Color: {color}
            Sleep Duration (Minutes): {sleep_time}
            The APGAR score is calculated as follows:

            Heart Rate: 0 points (below 60 bpm), 1 point (60 to 100 bpm), 2 points (above 100 bpm)
            Temperature: 0 points (hypothermic or hyperthermic), 1 point (mildly abnormal), 2 points (normal)
            Color: 0 points (blue/pale), 1 point (blue extremities), 2 points (normal color)
            Sleep Cycle: 0 points (unresponsive), 1 point (mildly drowsy), 2 points (alert and responsive)
            Once the APGAR score is calculated, please provide a brief, 2-3 line summary of the baby's health status based on the score. For example:

            For a score of 7-8, the summary should indicate that the baby is generally in good health and requires no immediate intervention.
            For a score of 4-6, indicate that the baby may need medical support but is not in critical condition.
            For a score of 0-3, indicate that the baby is in critical condition and needs immediate resuscitation or intervention.
            
            From the above content give the APGAR SCORE value alone and also give some metadata based on the APGAR SCORE.
    '''
    

    prompt = PromptTemplate(
        input_variables=['heart_rate', 'temperature', 'color', 'sleep_time'],
        template=prompt_template
    )

    input_values = {
        'heart_rate': heart_rate,
        'temperature': temperature,
        'color': color,
        'sleep_time': sleep_time
    }

    formatted_prompt = prompt.format(**input_values)

    completion = client.chat.completions.create(
        model="gpt-4",  # Using GPT-4 model
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": formatted_prompt}
        ]
    )

    formatted_response = completion.model_dump()
    response_message = formatted_response["choices"][0]["message"]["content"]
    print(response_message)

    # Save response to a text file
    save_to_file("Data/apgar_summary.txt", response_message)
    
    return response_message

def main():
    # Example input values (replace with actual values or dynamically provide them)
    with open("bpm_data.txt", "r") as file:
        file_content = file.read()
    # Print the content of the text file
    print('The Heart Rate Value',file_content)
    heart_rate = file_content
    with open("temperature.txt", "r") as file:
        file_content = file.read()
    temperature = file_content
    with open("skin_tone_data.txt", "r") as file:
        file_content = file.read()
    color = file_content
    sleep_time = 120

    while True:
        llm_response(heart_rate, temperature, color, sleep_time)
        time.sleep(10)  # Wait for 30 seconds before running again

if __name__ == '__main__':
    main()

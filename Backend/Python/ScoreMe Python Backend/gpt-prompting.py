from dotenv import load_dotenv
import langchain
import os
import sys

# PRINT API KEYS
load_dotenv()
GPT_API_KEY = os.getenv("GPT_API_KEY")
print(GPT_API_KEY)

print(sys.executable)

#chatgpt prompting
from openai import OpenAI
client = OpenAI(api_key=GPT_API_KEY)

response = client.chat.completions.create(
    messages=[{
        "role": "user",
        "content": "Say this is a test",
    }],
    model="gpt-4o-mini",
).choices[0].message.content

print(response)
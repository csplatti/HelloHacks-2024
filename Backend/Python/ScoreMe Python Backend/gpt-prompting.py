from dotenv import load_dotenv
import langchain
import os
import sys

# PRINT API KEYS
load_dotenv()
GPT_API_KEY = os.getenv("GPT_API_KEY")
print(GPT_API_KEY)

print(sys.executable)
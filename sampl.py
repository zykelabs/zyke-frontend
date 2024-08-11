import anthropic

client = anthropic.Anthropic(api_key = "REDACTED-REVOKED-ANTHROPIC-KEY")

with client.messages.stream(
      model="claude-3-5-sonnet-20240620",
      max_tokens=4096,
      temperature=1,
      system='act like a friendly bot',
      messages=[
          {
              "role": "user",
              "content": [
                  {
                      "type": "text",
                      "text": "Write me a sonnet about the ocean."
                  }
              ]
          }
      ]
  )as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
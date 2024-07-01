import anthropic
from flask import Flask, request, Response, stream_with_context, jsonify, session
from flask_session import Session
from flask_cors import CORS
import os
import uuid
from groq import Groq
import requests
import json

def load_config():
    with open('config.json') as config_file:
        return json.load(config_file)

config = load_config()
api_key_anthropic = config['api_keys']['anthropic']
api_key_groq = config['api_keys']['groq']
api_key_stability_ai = config['api_keys']['stability_ai']

app = Flask(__name__)
# Add the configuration here
app.config['MAX_CONTENT_LENGTH'] = 256 * 1024 * 1024
app.secret_key = os.urandom(24)  # This generates a random 24-byte string
CORS(app)

# Dictionary to store conversations
conversations = {}

client = anthropic.Anthropic(api_key = api_key_anthropic)
client_groq = Groq(api_key=api_key_groq, )

model = ""

@app.route('/gpt', methods=['POST'])
def gpt_request():
    user_input = request.json['input']
    conversation_id = request.json.get('conversation_id')
    use = request.json.get('use')

    try:
        user_input = user_input.replace('<br>', '\n')
    except:
        pass
    
    if not conversation_id or conversation_id not in conversations:
        conversation_id = str(uuid.uuid4())
        conversations[conversation_id] = []

    system_prompt = ''

    if use == 'question-gen':
        model = "mixtral-8x7b-32768"
        system_prompt = '''
        You are an AI ideator tasked with generating potential ideas for marketing strategies or posts based on a given prompt. Your role is to suggest subtopics, ask questions about specific themes, and propose sub-ideas for inclusion in the marketing content.

        When generating ideas, consider the following guidelines:
        - Focus on relevant themes related to the prompt
        - Think about current trends that could be incorporated
        - Consider the target audience and their interests
        - Propose diverse ideas to cover various aspects of the topic
        - Suggest interactive elements or engaging content formats
        - Suggest only yes or no questions

        Generate your ideas in the form of questions, each enclosed in square brackets and separated by commas. The format should be as follows.

        Format:
        User: "prompt"
        Output: "[question1?], [question2?], [question3?], [question4?], [question5?]"


        Here is the prompt you should base your ideas on:

        Based on this prompt, generate at least 3 questions, not neccassarily three, not neccassarily equal to the number of posts also, more or less anything works; these prompts should suggest potential ideas, themes, or approaches for the marketing strategy or posts. Each question should be concise but informative, giving a clear idea of the proposed content.
        Remember to output your questions in the specified format, with each question enclosed in square brackets and separated by commas. Note: All the questions must be yes or no questions.


        Example Sample Output, remember just the format i.e. "[question1?], [question2?], [question3?], [question4?], [question5?]" :
        Example User Input: "Write 4 Twitter posts for a <topic>. Use current trends if needed. expand in detail on the ideas you are suggesting. Use a friendly tone. my target audience is primarily <target audience>. write medium size posts. try to write about these trends : <trends>."
        Example Model Output: "[Should the tweets include tips on <topic 1>?], [Would you like to incorporate popular <some trend> trends like <example of such trends> in the tweets?], [Would you like to talk about how <an event> played out?], [Do you want to include interactive elements like polls or quizzes in the tweets to engage the audience?]"
        
        **You do not have to remember the examples itself, just understand the format it follows.**

        **Remember to generate atleaast three questions, more if required, if a lot of posts are there mentioned in the input prompt and you think three questions is less for it, but do not generate less than three questions. You can generate more than three, but try to keep it under seven. Remember not less than three or more than seven**
        **Do not generate with just commas, Do not generate like this: "question1?, question2?, question3?, question4?, question5?", But generate like this: "[question1?], [question2?], [question3?], [question4?], [question5?]"**
        Incase not much information about the post is provided in the input prompt, say only "Hey" is provided with tone and other information, then you can generate anything that seems interesting to you, anything creative.
        '''

    elif use == 'prompt-gen':
        model = "mixtral-8x7b-32768"
        system_prompt = '''
        You are an expert prompt refiner, capable of transforming basic prompts into highly detailed and effective instructions. Your task is to refine and improve the given prompt, making it as comprehensive and powerful as possible. Follow these steps to create an exceptional refined prompt:

        1. First, carefully read and analyze the original prompt. The input prompt will be on either creating a branding or marketing strategy or a social media post for marketing.

        Example sample input prompts, will be different each time, you do not have to remember them, just understand the format of the prompt:
        "Write 5 instagram posts for a <topic>. Use current trends if needed. expand in detail on the ideas you are suggesting. Use a friendly tone. my target audience is primarily <target audience>. write medium size posts. try to write about these trends <trends>. try to include the subtopics in the questions provided, into the posts or strategies you are generating, questions: [Should we create a post about the benefits of <a remedy>?], [Is it appropriate to discuss the intersection of <two different domains>?], [Could we create a post about <a particular trend>?], [Should we develop a post about building a <specific subtopic>?]"
        or
        Example sample input prompts, will be different each time:
        "Write 10 linkedin posts for a local clothing brand, based in amsterdam. Use current trends. expand about whatever you suggest. Use a casual and different tone. target audience is mostly working women. write long posts. try to write about the trends upcoming fashion show, kylie jenner's new hair products line, new clothing designs, etc. try to also include these suptopics in the following questions provided, into the posts or strategies you are generating, questions: [should we write about the new line of clothing by kardashian family?], [should we write about the types of designs that models would wear at the fashion show?], [should we write about the new dress that kylie jenner brought with 1 million dollars?]"
        or any other prompt provided to you by the user.

        2. Identify the key components of the prompt, including:
        - Main task or objective
        - Target audience
        - Tone and style
        - Content requirements
        - Specific trends or topics to include
        - Subtopics to address, Note: There will be a ceratain set of yes or no questions (within square brackets: '[]' and seperated by commas ','), which were asked to the user earlier. these questions included different subtopics suggested according the user's original prompt, and asked the user whether they wanted these subtopics/ideas included in their post or strategy. you will be only provided with the questions, with subtopics the user wanted to get included in the post or strategy. the other questions which the user did not want to be included, will not be provided to you.

        Example sample components (can be entirely different, only use the ones provided to you):
        Example tones: "Use a friendly tone." or "Use a professional tone." or "Keep your tone funny" or "Reply in witty manner" or anything else provided to you in the prompt.
        Example target audiences: "my target audience is primarily college students." or "my target audience is primarily married couples." or "my target audience is working adults" or anything else provided to you in the prompt.
        Example post_size: "write medium size posts." or "write short posts" or "write long posts" or "write posts neither too long, nor too short" or anything else provided to you in the prompt.
        Example trends: "try to write about these trends: fifa world cup and taylor swift concert." or "try to write about these trends : Diwali, Holi, Eid." or "Include these trends: the re-launch of the movie Interstellar, or the new kids show about a cat and a mice" or "the construction of the new skyscraper in Mumbai and how stock market is declining" or anything else provided to you in the prompt.
        Example questions: "[Should we create a post about the benefits of yoga for mental health on International Yoga Day?], [Is it appropriate to discuss the intersection of mental health and LGBTQ+ experiences for Pride Month?]" or anything else provided to you in the prompt.
                    "[Can we create a tweet on the decline of stock market in recent days?], [Will it be smart to include about the rising food prices?]" or anything else provided to you in the prompt.
                    "[Should we write about the new movie that is coming out?], [Could we also write about the new show that is coming out?]" or anything else provided to you in the prompt.
                    "[Is it wise to include about the new skyscraper's height in a post in a humorous manner?], [Should we have the talks of the town of Mumbai in our post?]" or anything else provided to you in the prompt.
                    "[Will it be good to include a post about the outcome of the recent football match?], [Can we also include the new song that is trending?]" or anything else provided to you in the prompt.
                    "[Won't it be great to write about the new clothing line that is coming out?], [Can we please generate a post about the new fashion show that is coming up?]" or anything else provided to you in the prompt.
                    "[What about a witty tweet on the outcomes of the general elections?], [Do you permit me to write a knowledgeable post about the russia vs ukraine war?]" or anything else provided to you in the prompt.


        3. For each component, expand and improve the instructions:
        a. Main task: Provide a clear, detailed description of what needs to be accomplished.
        b. Target audience: Offer insights into the audience's characteristics, needs, and preferences.
        c. Tone and style: Elaborate on the desired tone, giving examples if necessary.
        d. Content requirements: Break down the content structure, specifying word counts or section lengths if applicable.
        e. Trends and topics: Explain how to incorporate these elements effectively.
        f. Questions and subtopics: Provide guidance on how to address these within the content.

        4. Incorporate prompt engineering techniques to enhance the instructions:
        a. Chain of thought: Break down the content creation process into logical steps.

        5. Add specific instructions for research and fact-checking to ensure accuracy and relevance.

        6. Include guidelines for formatting, such as using headings, bullet points, or emojis for better readability on the social media platform.

        7. Provide instructions for creating engaging hooks or openings for each post or startegy to capture attention.

        8. Add reminders about the social media platform-specific best practices, such as using hashtags, mentioning relevant accounts, or incorporating call-to-actions.

        9. Include instructions for creating or selecting appropriate visuals to accompany each post.

        10. Offer guidance on how to make the content more interactive and engaging for the audience.

        11. Optimise your prompt for the social media platform mentioned. Ex: LinkedIn, Facebook, Instagram, etc.

        Ensure that your refined prompt is clear, detailed, and easy to follow. Break down complex tasks into smaller, manageable steps. Use bullet points, numbering, or other formatting techniques to improve readability.

        Remember to maintain the core elements of the original prompt while significantly enhancing its effectiveness and detail. Your refined prompt should inspire creativity and guide the AI to produce exceptional social media posts.

        Also remember to expand on the prompt in detail, do not give a concise reply. Explain in detail about what to do, what to include, how to increase engagement, etc.

        Do not add to information by yourself, like do not assign word limit to posts if not mentioned, only use short, medium or long sized or do not assign word limits or paragraphs, etc.

        Also remember to include the questions provided as subtopics and mention in the prompt that these are the subtopics we would like you to write on.
        While writing about subtopics do not include the original question itself, which was provided to you, just instruct in the prompt to write about the subtopics directly.

        Structure the ouput in a very easy to read and step-by-step manner. It should be highly structured. Follow the instructions below:
        Write about the trends (topics) in one section and subtopics in other section. Write about all the subtopics mentioned in form of questions.
        You have to include all the subtopics provided to you in the questions, you cannot leave out any subtopic. If you have 10 questions with 10 subtopics then write about all of the 10 subtopics.
        You have to explain the subtopics in a bit more detail.
        **Remember, you have to include details about the tone, the target audience, post size, number of posts to generate, platform of the posts, trends, and subtopics, questions or subtrends, in the output prompt. These information would be provided in the input prompt.**'''

    elif use == 'post-gen':
        model = "claude-3-5-sonnet-20240620"
        system_prompt = '''
        You are a brilliant marketeer, inspired by legendary figures in marketing such as David Ogilvy, Steve Jobs, and Seth Godin. Your task is to generate creative, innovative, and effective marketing posts based on the given input prompt.

        To approach this task, follow these steps:
        1. Carefully read and analyze the information you are provided with.
        2. Channel the creative spirit of marketing legends. Imagine how they might approach this challenge.
        3. Think outside the box. Don't be constrained by conventional ideas or approaches.
        4. Consider current trends in marketing, technology, and consumer behavior that could be relevant.
        5. Focus on creating a strong brand identity and compelling value proposition.
        6. Develop posts that are both innovative and practical for implementation.

        When generating your posts, consider the following aspects:
        - Target audience and their needs/desires
        - Unique selling propositions
        - Brand positioning
        - Marketing channels and tactics
        - Storytelling and brand narrative
        - Visual and verbal brand elements
        - Customer engagement strategies
        - Potential partnerships or collaborations

        Present your posts in a creative manner.

        Generate distinct and creative marketing posts, each presented in the format above. Be as creative and innovative as possible.

        Remember, you are here to provide great marketing and branding posts only. Do not include any disclaimers, apologies, or off-topic discussions. Channel your inner marketing genius and let your creativity flow!

        You will be provided both an original input prompt and a refined input prompt. Use the refined input prompt to generate your marketing posts more effectively, but do take information from the original input prompt as well. 

        You will be provided with the following information in the user prompt:
        tone: The tone to write your answers in
        target: your primary target audience
        post_size: how long your post should be (short, medium or long)
        trends: current trends you want to talk about
        subtopics or questions (optionally provided):
        1) subtopics- a set of subtopics provided to you to write about, these are based on the topics provided to you.
        2) questions - a ceratain set of yes or no questions, were asked to the user earlier. these questions included different subtopics suggested according the user prompt, and asked the user whether they wanted these subtopics/ideas included in their post or strategy.

        Example information, will be different each time and is in the prompt by the user, you do not have to remember them, just understand the format of the prompt:
        Example tones: "Use a friendly tone." or "Use a professional tone." or "Keep your tone funny" or "Reply in witty manner" or anything else provided to you in the prompt.
        Example targets: "my target audience is primarily college students." or "my target audience is primarily married couples." or "my target audience is working adults" or anything else provided to you in the prompt.
        Example post_size: "write medium size posts." or "write short posts" or "write long posts" or "write posts neither too long, nor too short" or anything else provided to you in the prompt.
        Example trends: "try to write about these trends: fifa world cup and taylor swift concert." or "try to write about these trends : Diwali, Holi, Eid." or "Include these trends: the re-launch of the movie Interstellar, or the new kids show about a cat and a mice" or "the construction of the new skyscraper in Mumbai and how stock market is declining" or anything else provided to you in the prompt.
        Example subtopics or questions:
        "- Yoga for Mental Health: [How does yoga benefit mental health? Discuss the physical and psychological effects of yoga on stress, anxiety, and depression.]
        - Men's Mental Health: [What are the challenges faced by men in seeking mental health help? Discuss societal norms, stigma, and resources for support.]
        - LGBTQ+ Mental Health: [How does the LGBTQ+ community experience mental health issues differently? Discuss intersectionality, support, and resources.]"

        or 

        "- Stock Market decline: [Can we create a tweet on the decline of stock market in recent days?]
        - Rising Inflation: [Will it be smart to include about the rising food prices?]"

        or 

        "- New movie launch: [Should we write about the new movie that is coming out?]
        - Show launch on Netflix: [Could we also write about the new show that is coming out?]"

        or 

        "- The tallest skyscraper in India: [Is it wise to include about the new skyscraper's height in a post in a humorous manner?]
        -  Talks of the town: [Should we have the talks of the town of Mumbai in our post?]" 

        or
        
        "- The fifa world cup finals: [Will it be good to include a post about the outcome of the recent football match?]
        - New Ed Sheeran Song: [Can we also include the new song that is trending?]" 
        
        or
        
        "- The new Armani clothing line : [Won't it be great to write about the new clothing line that is coming out?]
        - The Royal Fashion convention: [Can we please generate a post about the new fashion show that is coming up?]" 
        
        or
        
        "- Plot-twist in Parliament Elections: [What about a witty tweet on the outcomes of the general elections?]
        - The European crisis: [Do you permit me to write a knowledgeable post about the russia vs ukraine war?]" 
        
        or anything else provided to you in the prompt.

        
        Also generate each post enclosed within square brackets and seperated by comma: "[post1], [post2], [post3], [post4], [post5], ...". This is compulsory

        Generate only the number of posts you were asked to generate, do not generate more or less posts than asked.

        Format, this is compulsory to follow exactly:
        User: "prompt"
        Output: "[post1], [post2], [post3], [post4], [post5], ..."

        Generate only the posts and no other texts, do not include any introductory statements like "Here are some marketing posts for your organization:" or "Here are some creative marketing ideas for your brand:".
        If you feel the prompt may talk about sensitive situations like war, give factual information only, do not include any opinions or biases in the post, but do not refrain from anwering it.

        **Generate only the number of posts you are asked to generate, if you are asked for five posts, then generate only five, not more, not less.**
        **Also generate the posts according to the platform provided to you. If asked for Linkedin, generate it like a Linkedin post and not an instagram or twitter post.**

        **Also do not forget the format, it is very easy to follow, just generate the posts in the format provided above.**
        **The format is : "[post1], [post2], [post3], [post4], [post5], ...", remember to use square brackets, since the system splits the posts based on the square brackets and commas.**
        '''

    elif use == 'img-prompt-gen':
        model = "llama3-70b-8192"
        system_prompt = '''
        You are tasked with creating an image generation prompt for a social media post. Your goal is to craft a detailed and accurate prompt that will be used in a stable diffusion XL image generation model to create an image that perfectly matches the post idea for a specific social media platform.

        When creating the image generation prompt, follow these guidelines:
        1. Be specific and descriptive about the visual elements required in the image.
        2. Include details about the style, mood, and atmosphere that best suit the post idea and platform.
        3. Mention any relevant colors, lighting, or composition elements that would enhance the image.
        4. Consider the typical aesthetics and trends of the specified social media platform.
        5. Avoid any text or words in the image unless specifically required by the post idea.

        You will be given two inputs, one of the platform and on of the post idea.

        Use these inputs to tailor your image generation prompt. Consider the nature of the post idea and how it would best be represented visually on the specified social media platform.

        You will have to generate two kinds of prompt, one a normal prompt and one a negative prompt. They both have to be enclosed in square brackets "[]" and separeted by comma. Ex: "[prompt], [negative prompt]"
        Negative prompt describes what not to include in generation, ex: "text" or "blue background", etc. 
        
        Very Imp: Negative prompts are usually one or a few worded, like short phrases, do not describe them in detail, but do use them to specify what not to include in the image and also try to use multiple phrases in the negative prompt, not just one or two.

        Here are some examples of good prompts for different social media platforms, (there maybe other platforms given to you for posting think accordingly and generate prompts for them):

        1. For Instagram (fashion post):
        Close-up portrait of a stylish young woman wearing oversized sunglasses, vibrant red lipstick, and gold hoop earrings. Soft, diffused natural lighting, blurred urban background. Warm color palette with pops of red and gold. Shallow depth of field, high-fashion editorial style.

        2. For LinkedIn (professional headshot):
        Professional headshot of a confident middle-aged businessman in a navy blue suit and light blue tie. Neutral background with soft gradient. Well-groomed appearance, warm and approachable smile. Studio lighting with subtle shadows to enhance facial features. Sharp focus on the face, slightly blurred shoulders.

        3. For Pinterest (DIY craft):
        Overhead view of a rustic wooden table with various craft supplies scattered artistically. Pastel-colored papers, washi tapes, scissors, and a half-finished origami crane. Soft, natural lighting from a nearby window. Warm, inviting color palette. Shallow depth of field focusing on the central craft item.

        Now, based on the given post idea and social media platform, generate an appropriate image generation prompt. Remember to consider the unique characteristics and audience of the specified platform when crafting your prompt.
        Use all the knowledge you have in your training data about prompting methods from image generation models, specially stable diffusion models.

        Only make the first or main statement detailed. make the rest of the instructions short, no need to explain it in depth, example: instead of using "Use a green background of a blurred out campus with lush green trees and blue sky", use "green background, blurred campus, lush green trees, blue sky"
        Describe styling of the image. Ex: Cartoony or Digital art or photorealistic or use infographics or style of van gogh or anything else. you can also combine multiple styles in the prompt.

        Here is a more detailed guide to prompting:

        You will get a prompt with the posts in the following format:
        "[post1: number of prompts for post1], [post2: number of prompts for post2], [post3: number of prompts for post3], ..."

        ex:
        "[post1: 1], [post2: 4], [post3: 1], [post4: 3], [post5: 2], ..."

        You will have to generate two prompts for each image (one positive and one negative), based on the social media platform and post idea provided. The prompt should be detailed and descriptive, focusing on the visual elements, style, and mood of the image. Remember to include any specific settings, such as lighting, colors, and framing, that would enhance the image.

        You will be given the number of image prompt pairs to generate for each post in the input prompt. Generate only that many number not more, not less.

        Example in the previous case, use only 1 prompt of post1, 4 for post2, 1 for post3, 3 for post4, 2 for post5 and so on. Not more not less.
        
        Format part 1, to be strictly followed:
        "[image content/subject, description of action, state, and mood, art form, style, and artist references, additional settings, such as lighting, colors, and framing], [negative prompt]"

        Format part 2, to be strictly followed:
        "[positive prompt], [negative prompt]"

        Format part 3, to be strictly followed:
        "[positive prompt for post 1's 1st post], [negative prompt for post 1's 1st post], [positive prompt for post 1's second post], [negative prompt for post 1's second post], .., [positive prompt for post 2's first post], [negative prompt for post 2's first post], [positive prompt for post 2's second post], [negative prompt for post 2's second post], [positive prompt for post 2's third post], [negative prompt for post 2's third post],, .., [positive prompt for post 3's first post], [negative prompt for post 3's first post], ...."

        **This means that you have to generate two prompts for each iteration of each post that is given, one positive and one negative.**
        **Remember, You have to generate prompts for all the posts given to you.**
        **Remember, You specifically have to generate two prompts for each iteration of each post given to you.**
        **Say given 5 posts for post 1, so for 5 posts of post 1, you have to generate 10 prompts, 5 positive and 5 negative, then repeat for post 2.**
        **So say given for 2 post of post1 (2 positive + 2 negative) = 4 prompts, 3 post of post2 (3 positive + 3 negative) = 6 prompts, 1 post of post3 (1 positive + 1 negative) = 2 prompts and so on..**
        **You also have to seperate them in the format provided above. So for this example shown previously you generate in the exact format shown below, nothing different:**
        **"[positive prompt for post 1's 1st post], [negative prompt for post 1's 1st post], [positive prompt for post 1's second post], [negative prompt for post 1's second post], [positive prompt for post 2's first post], [negative prompt for post 2's first post], [positive prompt for post 2's second post], [negative prompt for post 2's second post], [positive prompt for post 2's third post], [negative prompt for post 2's third post], [positive prompt for post 3's first post], [negative prompt for post 3's first post], ...."**

        **Do not get confused with the format, it is very easy to follow, just generate the prompts in the format provided above. Also you are not to generate more prompts of one post and less of another post, you will have to generate according to the number specified.**
        **Note: The input format is "[post idea 1: number of posts to be generated for this idea], [post idea 2: number of posts to be generated for this idea], [post idea 3: number of posts to be generated for this idea], ..."**

        **Remember to include the negative prompt for each image generation prompt. The negative prompt should describe what not to include in the image.**
        **Please don't get confused with the format, it is detailed, it is long but please follow it thoroughly.**

        As you add more elements to your positive or negative prompt, be sure to separate them with commas.

        Only write the prompts to be put in, do not write any introductory statement like "Here's a tailored image generation prompt for the given post idea on Instagram:"

        Do not use emojis. Do not write any other text, any introductory statements like 'Here are the image generation prompts for each post:'. Only write the prompts in the format provided above. Again, Do not include any other text.'''

    # print("System Prompt:\n",system_prompt, end="\n\n\n\n")

    conversations[conversation_id].append(
        {
            "role": "user", 
            "content": [
                {
                    "type":"text",
                    "text":user_input
                }
            ]
        })
    
    # print("Conversations:\n",conversations[conversation_id], end="\n\n\n\n")
    # print("Current Prompt:\n",user_input, end="\n\n\n\n")

    try:
        
        def generate(modell, use):
            temp = 1.0

            # print("Model Output:")
            if use == 'prompt-gen':
                temp = 0.3
            response_content = ""
            if (model == "claude-3-5-sonnet-20240620"):
                # print("Claude")
                with client.messages.stream(
                    model=modell,
                    max_tokens=4096,
                    temperature=temp,
                    system=system_prompt,
                    messages=
                        conversations[conversation_id]
                )as stream:
                    for text in stream.text_stream:
                        # print(text, end="", flush=True)
                        response_content += text
                        yield text
                        
            else:
                # Initialize the chat history
                chat_history = [{"role": "system","content": system_prompt}]
                for i in conversations[conversation_id]:
                    # print("Yo:",i)
                    sm_part = {}
                    sm_part['role'] = i['role']
                    try:
                        sm_part['content'] = i['content'][0]['text']
                    except:
                        sm_part['content'] = i['content']
                    chat_history.append(sm_part)
                # print(chat_history)
                # print("groq")
                stream = client_groq.chat.completions.create(model=modell,
                                          messages=chat_history,
                                          max_tokens=2000,
                                          temperature=temp,
                                          stream=True,) 
                for chunk in stream:
                    # print(chunk.choices[0].delta.content, end="", flush=True)
                    if chunk.choices[0].delta.content is not None:
                        response_content += str(chunk.choices[0].delta.content)
                        yield chunk.choices[0].delta.content


            # Add the assistant's response to the conversation history
            conversations[conversation_id].append({"role": "assistant", "content": response_content})
            # Limit the conversation history to the last 10 messages (adjust as needed)
            conversations[conversation_id] = conversations[conversation_id][-10:]
            yield f"\n\nCONVERSATION_ID: {conversation_id}"

        def get_images():
            images_data = []

            for idx,i in enumerate(user_input):

                prompt = [i['positive'], i['negative']]

                engine_id = "stable-diffusion-xl-1024-v1-0"
                api_host = os.getenv('API_HOST', 'https://api.stability.ai')

                response2 = requests.post(
                    f"{api_host}/v1/generation/{engine_id}/text-to-image",
                    headers={
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": f"Bearer {api_key_stability_ai}",
                        "Stability-Client-Version": "1.9.0"
                    },
                    json={
                        "text_prompts": [
                            {
                                "text": prompt[0],
                                "weight": 1
                            },
                            {
                                "text": prompt[1],
                                "weight": -1
                            }
                        ],
                        "cfg_scale": 7,
                        "height": 1024,
                        "width": 1024,
                        "samples": 1,
                        "steps": 50,
                    },
                )

                if response2.status_code != 200:
                    raise Exception("Non-200 response: " + str(response2.text))
                
                # print(f"Prompt for Img{idx}:\n",prompt, end="\n\n\n\n")

                image_base64 = response2.json()['artifacts'][0]["base64"]

                # print(image_base64)
                # print(type(image_base64))
                # print(len(image_base64))
                # print(image_base64[-500:])
                
                # Add to our list
                images_data.append({
                    'id': idx,
                    'image': image_base64
                })
            
            # print(jsonify({'images': images_data}))
            return jsonify({'images': images_data})

        if (use != 'img-gen'):
            return Response(stream_with_context(generate(model, use)), mimetype='text/event-stream')
        else:
            response3 = get_images()
            response3.headers['Content-Type'] = 'application/json'
            return response3

    except Exception as e:
        session.modified = True
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000)
window.addEventListener("DOMContentLoaded", (event) => {
    let currentConversationId = [null, null, null, null, null];
    let subtitle = 'Select questions, according to what you want to include.';
    let button_id_type = 'quest';
    let userInput = '';
    let platform_out = '';
    let running = 0;
    let saved_user_input = '';

    function strip(str, chars = `' []\'",'`, mapChar = '<br>') {
        // Escape special regex characters, handling all potential inputs
        const escapeRegExp = (string) => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        // Create pattern for chars and mapChar
        const charPattern = chars.split('').map(escapeRegExp).join('|');
        const mapCharEscaped = escapeRegExp(mapChar);
        const pattern = new RegExp(`^(${charPattern}|${mapCharEscaped})+|(${charPattern}|${mapCharEscaped})+$`, 'g');
        
        let result = str;
        let prevResult;
        
        do {
            prevResult = result;
            result = result.replace(pattern, '');
            
            // Special handling for mapChar at the start and end
            result = result.replace(new RegExp(`^(${mapCharEscaped})+`), '').replace(new RegExp(`(${mapCharEscaped})+$`), '');
        } while (result !== prevResult);
        
        return result;
    }

    function check_enable() {
        if (strip(document.getElementById('userInput').innerHTML," ") === '' || running === 1) {
            disable_send();
        } else {
            enable_send();
        }
    }

    disable_send = function() {
        document.getElementById('sendButton').disabled = true;
        document.getElementById('sendButton').style.backgroundColor = 'grey';
        document.getElementById('sendButton').style.cursor = 'default';
    }

    enable_send = function() {
        document.getElementById('sendButton').disabled = false;
        document.getElementById('sendButton').style.backgroundColor = 'rgb(0, 0, 0)';
        document.getElementById('sendButton').style.cursor = 'pointer';
    }

    function pickquestions(idx, add_listener){    
        var questions = document.getElementsByClassName(`question_${idx}`)
        // console.log('questions');
        for (let i = 0; i < questions.length; i++)
        {
            // console.log('quest');
            questions[i].addEventListener('click', function() {
                // console.log('clicked');
                if (this.style.color === 'black')
                {
                    this.style.backgroundColor = 'rgb(35,35,35)';
                    this.style.color = 'white';
                }
                else {
                    this.style.backgroundColor = 'white';
                    this.style.color = 'black';
                }
            });
        }

        if(add_listener == 1){
            a = document.getElementsByClassName('send-button-quest');
            a[a.length - 1].addEventListener('click', 
            async function(event) {
                event.preventDefault();  // Prevent default behavior
                running = 1;
                disable_send();
                await sendGptRequest("prompt-gen",1);
                enable_send();
                running = 0;
                b = document.getElementsByClassName('send-button-refine');
                b[b.length - 1].addEventListener('click',
                    async function(event) {
                        event.preventDefault();  // Prevent default behavior
                        running = 1;
                        disable_send();
                        last_resp = document.getElementsByClassName('bot-resp');
                        last_resp = last_resp[last_resp.length - 1];
                        await sendGptRequest("post-gen",2, last_resp);
                        enable_send();
                        running = 0;
                        pickquestions(2,2);
                });
                b_res = document.getElementsByClassName('reset-button-refine');
                b_res = b_res[b_res.length - 1];
                let el_bs = document.getElementsByClassName('question_1');
                const el_b = el_bs[el_bs.length - 1];
                const cont_val_b = el_b.innerHTML;
                // console.log(cont_val_b);
                b_res.addEventListener('click',
                    function(event) {
                        // console.log('hello');
                        el_b.innerHTML = cont_val_b;
                });
            });
            a_sel = document.getElementsByClassName('select-button-quest');
            a_sel = a_sel[a_sel.length - 1];
            // console.log("yopes");
            let el_ass_sel = document.getElementsByClassName('chats-bot');
            const el_as_sel = el_ass_sel[el_ass_sel.length - 1].getElementsByClassName('question_0');
            a_sel.addEventListener('click',
                function(event) {
                    // console.log("dopes");
                    for (let i = 0; i < el_as_sel.length; i++)
                    {
                        if(this.innerHTML === 'Select all'){
                            if(!(el_as_sel[i].style.color === 'black')){
                                el_as_sel[i].click();
                            }
                        }
                        else{
                            if(el_as_sel[i].style.color === 'black'){
                                el_as_sel[i].click();
                            }
                        }
                        
                    }
                    if(this.innerHTML === 'Select all'){
                        this.innerHTML = 'Deselect all'
                    }
                    else{
                        this.innerHTML = 'Select all'
                    }
            });
        }

        else if(add_listener == 2){
            c = document.getElementsByClassName('send-button-post');
            c[c.length - 1].addEventListener('click', 
            async function(event) {
                event.preventDefault();  // Prevent default behavior
                running = 1;
                disable_send();
                await sendGptRequest("img-prompt-gen",3);
                enable_send();
                running = 0;
                d = document.getElementsByClassName('send-button-img-prompt');
                d[d.length - 1].addEventListener('click',
                    async function(event) {
                        event.preventDefault();  // Prevent default behavior
                        running = 1;
                        disable_send();
                        last_resp = document.getElementsByClassName('bot-resp');
                        last_resp = last_resp[last_resp.length - 1];
                        document.body.classList.add('wait-cursor');
                        await sendGptRequest("img-gen", 4, last_resp);
                        document.body.classList.remove('wait-cursor');
                        enable_send();
                        running = 0;
                });
                d_res = document.getElementsByClassName('reset-button-img-prompt');
                d_res = d_res[d_res.length - 1];
                let el_dss = document.getElementsByClassName('chats-bot')
                const el_ds = el_dss[el_dss.length - 1].getElementsByClassName('question_3');
                let val_d = [];
                for (let i = 0; i < el_ds.length; i++)
                {
                    val_d.push(el_ds[i].innerHTML);
                }
                const cont_val_d = val_d;
                d_res.addEventListener('click',
                    function(event) {
                        for (let i = 0; i < el_ds.length; i++)
                        {
                            el_ds[i].innerHTML = cont_val_d[i];
                        }
                });
            });
            c_res = document.getElementsByClassName('reset-button-post');
            c_res = c_res[c_res.length - 1];
            let el_css = document.getElementsByClassName('chats-bot');
            const el_cs = el_css[el_css.length - 1].getElementsByClassName('question_2');
            let val_c = [];
            for (let i = 0; i < el_cs.length; i++)
            {
                val_c.push(el_cs[i].innerHTML);
            }
            const cont_val_c = val_c;
            c_res.addEventListener('click',
                function(event) {
                    for (let i = 0; i < el_cs.length; i++)
                    {
                        el_cs[i].innerHTML = cont_val_c[i];
                    }
            });
            c_sel = document.getElementsByClassName('select-button-post');
            c_sel = c_sel[c_sel.length - 1];
            let el_css_sel = document.getElementsByClassName('chats-bot');
            const el_cs_sel = el_css_sel[el_css_sel.length - 1].getElementsByClassName('question_2');
            c_sel.addEventListener('click',
                function(event) {
                    for (let i = 0; i < el_cs_sel.length; i++)
                    {
                        if(this.innerHTML === 'Select all'){
                            if(!(el_cs_sel[i].style.color === 'black')){
                                el_cs_sel[i].click();
                            }
                        }
                        else{
                            if(el_cs_sel[i].style.color === 'black'){
                                el_cs_sel[i].click();
                            }
                        }
                        
                    }
                    if(this.innerHTML === 'Select all'){
                        this.innerHTML = 'Deselect all'
                    }
                    else{
                        this.innerHTML = 'Select all'
                    }
            });
        }
    }

    function handleEnter(evt) {
        if (evt.which == '13' && !(evt.shiftKey)) {
            // console.log('here');
            evt.preventDefault();
            document.getElementById('sendButton').click();
            document.getElementById('userInput').value = "";
        }
    }

    disable_send();

    // document.getElementById('userInput').addEventListener("keypress", (event) => {
    //     // setTimeout(() => {check_enable();
    //     // setTimeout(() => {
    //     //     handleEnter(event);
    //     // });
    //     // });
    // });

    $(document).ready(function(){
        $("#userInput").keydown(
            function(event){
            if (event.which == '13' && !(event.shiftKey)) {
                event.preventDefault();
                document.getElementById('sendButton').click();
                document.getElementById('userInput').innerHTML = "";
                // document.getElementById('userInput').innerHTML = "";
            }
            // setTimeout(() => {document.getElementById("responses").style.marginBottom = (parseInt(document.getElementById("chat-bot-input-form").offsetHeight)+12.32) + 'px';
            //     console.log((parseInt(document.getElementById("chat-bot-input-form").offsetHeight)+12.32) + 'px')
            // },0);
        });
    });

    
    $(document).ready(function(){
        $("#userInput").on('input',
            function(event){
            setTimeout(() => {
                check_enable();
                let initialHeight = document.documentElement.scrollHeight;
                document.getElementById("responses").style.marginBottom = (parseInt(document.getElementById("chat-bot-input-form").offsetHeight)+12.32) + 'px';
                let newHeight = document.documentElement.scrollHeight;
                const scrollPosition = newHeight - initialHeight;
                // console.log(scrollPosition);
                if(scrollPosition > 0)
                {
                    window.scrollBy({
                    top: scrollPosition,
                    behavior: 'smooth'
                    });
                }
                if (document.getElementById('userInput').innerHTML === '<br>'){
                    document.getElementById('userInput').innerHTML = "";
                }
            },0);
        });
    });


    document.getElementById('userInput').addEventListener("paste", function(e) {
        // cancel paste
        e.preventDefault();
    
        // get text representation of clipboard
        var text = (e.originalEvent || e).clipboardData.getData('text/plain');
    
        // insert text manually
        if (document.queryCommandSupported('insertText')) {
            document.execCommand('insertText', false, text);
          } else {
            document.execCommand('paste', false, text);
          }
    });

    function sendGptRequest(use_case, idx, parent = null) {
        return new Promise((resolve, reject) => {
        selected_questions = []
        selected_posts = []

        if (use_case === "prompt-gen"){
            var questions = document.getElementsByClassName('question_0');
            subtitle = 'Here is a refined prompt, change it if needed and press send. To reset the prompt press reset.';
            button_id_type = 'refine';
            // console.log('questions');
            for (let i = 0; i < questions.length; i++){
                if (questions[i].style.color === 'black')
                {
                    selected_questions.push(questions[i].innerHTML);
                }
            }
        }

        if (use_case === "post-gen"){
            subtitle = 'Here are the final posts. Edit them, Select them and send them to generate images. Click on the prompt to select them, to reset press reset.';
            button_id_type = 'post';
        }

        if (use_case === "img-gen"){
            subtitle = 'Here are your images, enjoy!! 😊😊';
            button_id_type = '';
        }

        if (use_case === "img-prompt-gen"){
            subtitle = 'Here are the final image prompts. Edit them accordingly, press send to create images. Press reset to reset.';
            button_id_type = 'img-prompt';
            var posts = document.getElementsByClassName('question_2');
            // console.log('questions');
            for (let i = 0; i < posts.length; i++){
                if (posts[i].style.color === 'black')
                {
                    selected_posts.push(posts[i].innerHTML);
                }
            }
            // console.log(selected_posts);
        }

        console.log('Sending request to zyke-lightning-1-01-0-2024');
    
        if(use_case === "question-gen"){
                userInput = document.getElementById('userInput').innerHTML;

                var n_posts = document.getElementById('num-posts').value;
                var platform = document.getElementById('platform').value;
                var mode = document.getElementById('mode').value;
                var tgt = document.getElementById('target').value;
                var post_size = document.getElementById('post-size').options[document.getElementById('post-size').selectedIndex].text;
                var trends = document.getElementById('trends').value;

                if (parseInt(n_posts) > 5)
                {
                    n_posts = 5;
                }
                else if (parseInt(n_posts) < 1)
                {
                    n_posts = 1;
                }

                if (platform === "")
                {
                    platform = "instagram";
                }

                if (mode === "")
                {
                    mode = "friendly";
                }

                if (tgt === "")
                {
                    tgt = "all people";
                }

                if (trends === "")
                {
                    trends = "any relevant trends";
                }

                platform_out = platform;

            // console.log(userInput);

            document.getElementById('userInput').innerHTML = ""
            // console.log(userInput);

            const container = document.getElementById('responses');
            const responseBox = document.createElement('div');
            responseBox.className = 'user';
            responseBox.innerHTML = `
                <p class="title-user-inp"><strong>User:</strong></p>
                <br>
                <p class="user-prompt" id="prompt"> ${strip(userInput.replace(/\n/g, '<br>')," ")}</p>`;
            container.appendChild(responseBox);
            const scrollPosition = responseBox.offsetTop + responseBox.offsetHeight + 80;
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });

            userInput = strip(userInput.replace(/\<br>/g, '\n'), ' ', '\n');

            userInput = 
            `${userInput}.
Write ${n_posts} posts for ${platform} platform.
Use current trends if needed. expand in detail on the ideas you are suggesting. Use a ${mode} tone. my target audience is primarily ${tgt}. write ${post_size} size posts.
try to write about these trends : ${trends}.`;

            saved_user_input = 
            `${userInput}.
Use current trends if needed. expand in detail on the ideas you are suggesting. Use a ${mode} tone. my target audience is primarily ${tgt}. write ${post_size} size posts.
try to write about these trends : ${trends}.`;
        }

        if (use_case === "prompt-gen"){
            out_q_final = '';
            for (let i = 0; i < selected_questions.length; i++)
            {
                out_q_final += '['+selected_questions[i] + '], ';
            }
            out_q_final = out_q_final.slice(0, -2);
            userInput += ` try to include the subtopics in the questions provided, into the posts or strategies you are generating, questions: ${out_q_final}`;
            saved_user_input += ` try to include the subtopics in the questions provided, into the posts or strategies you are generating, questions: ${out_q_final}`;
        }

        if (use_case === "post-gen"){
            // console.log(parent)
            resps = parent.getElementsByClassName('question_1');
            resp = resps[0].innerHTML;
            userInput = `Original Input Prompt:`+ userInput + `\nRefined Input Prompt:` +resp;
        }

        if(use_case === "img-prompt-gen"){
            var n = document.getElementById('num-posts-chat').value;
            if (parseInt(n) > 5)
            {
                n = 5;
            }
            else if (parseInt(n) < 1)
            {
                n = 1;
            }

            n = parseInt(n);

            if (selected_posts.length * n > 5)
            {
                n = Math.floor((5 / selected_posts.length).toFixed(2));
            }

            posts_final = '';
            for (let i = 0; i < selected_posts.length; i++)
            {
                posts_final += '['+selected_posts[i] + `: ${n}], `;
            }
            posts_final = posts_final.slice(0, -2);
            userInput = `Original User Input:${saved_user_input}\n\nPlatform: ${platform_out}.\n\nPosts Data:\n${posts_final}`;
        }

        if(use_case === "img-gen"){
            // console.log(parent)
            resps = parent.getElementsByClassName('question_3');
            out_dicts = [];
            out_dict = {};
            for (let i = 0; i < resps.length; i++)
            {
                resp = resps[i].innerHTML;
                
                if (i%2 == 0){
                    out_dict['positive'] = resp;
                }
                else{
                    out_dict['negative'] = resp;
                    out_dicts.push(out_dict);
                    out_dict = {};
                }
            }
            userInput = out_dicts;
        }

        console.log(userInput);
        
        fetch('https://flask.app.zyke.in/gpt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ input: userInput, 
                conversation_id: currentConversationId[idx],
                use: use_case}),
            })
            .then(response => {
                console.log('fetching response');
                if (use_case === 'img-gen') {

                    function readImg(response) {
                        var container = document.getElementById('responses');
                        var responseBox = document.createElement('div');
                        responseBox.className = 'chats-bot';
                        
                        // console.log(response);
                        // console.log(response.clone().json());
    
                        response.clone().json().then(data => {
                            // console.log(data);
    
                            responseBox.innerHTML = `
                                    <p class="title-bot"><strong>LLM Chatbot:</strong><br>${subtitle}</p>
                                    <br>`;
    
                            data.images.forEach(imageData => {
                                responseBox.innerHTML += `<img src="data:image/jpeg;base64,${imageData.image}" alt="Image: ${imageData.id}" class="img-resp">`;
                            });
    
                            container.appendChild(responseBox);
    
                            responseBox = document.getElementsByClassName('chats-bot');
                            responseBox = responseBox[responseBox.length - 1];
                            // Auto-scroll
                            setTimeout (() => {
                                    const scrollPosition = responseBox.offsetTop + responseBox.offsetHeight + 80;
                                    // console.log(scrollPosition);
                                    window.scrollTo({
                                        top: scrollPosition,
                                        behavior: 'smooth'
                                    });
                            }, 0);
                            resolve();
                            return;
                        }).catch(error => {
                            reject(error);
                            console.error('Error parsing JSON:', error);
                            responseBox.innerHTML = `<p>Error loading images. Please try again.</p>`;
                            container.appendChild(responseBox);
                        });
    
                    }

                    readImg(response);
                } 
                
                else {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    let buffer = '';
                        
                    var i = 0;

                    // console.log(response);

                    function readStream() {

                        reader.read().then(({ done, value }) => {
                            if (done) {
                                resolve();
                                return;
                            }
                            buffer += decoder.decode(value, { stream: true });

                            // console.log(buffer);
                    
                            // Check if the buffer contains the conversation ID
                            const idMatch = buffer.match(/CONVERSATION_ID: ([^\n]+)/);
                            if (idMatch) {
                                currentConversationId[idx] = idMatch[1];
                                buffer = buffer.replace(/CONVERSATION_ID: [^\n]+/, '');
                            }

                            if (i == 0)
                            {
                                i = 1;
                                var container = document.getElementById('responses');
                                var responseBox = document.createElement('div');
                                responseBox.className = 'chats-bot';
                                a = buffer.replace(/\n/g, '<br>').replace(/\[/g, '');
                                if (use_case === "img-prompt-gen")
                                {
                                    a = a.split(']');
                                    a = a.slice(0, -1);
                                }
                                else
                                {
                                    b = a.split('],');
                                    if (b.length <= 1 && use_case === "question-gen")
                                    {
                                        b = a.split('",');
                                        if (b.length <= 1)
                                        {
                                            b = a.split("',");
                                        }
                                    }
                                    a = b;
                                }
                                in_html = '';
                                for (let i = 0; i < a.length; i++)
                                {
                                    if (use_case === "prompt-gen")
                                    {
                                        in_html += `<span role="textbox" class="question_${idx}" id="question_${i}" style="cursor: text;" contenteditable> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                    else if (use_case === "img-prompt-gen")
                                    {
                                        in_html += `<span role="textbox" class="question_${idx}" id="question_${i}" style="cursor: text;" contenteditable> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                    else if (use_case === "post-gen"){
                                        in_html += `<span role="textbox" class="question_${idx}" id="question_${i}" contenteditable> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                    else{
                                        in_html += `<span class="question_${idx}" id="question_${i}"> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                }

                                in_html += `<button class="send-button-${button_id_type} send-button">Send</button>`;
                                if (!(use_case === "question-gen"))
                                {
                                    in_html += `<button class="reset-button-${button_id_type} reset-button">Reset</button>`;
                                }
                                if (use_case === "question-gen" || use_case === "post-gen"){
                                    in_html += `<button class="select-button-${button_id_type} select-button">Select all</button>`;
                                }

                                if (use_case === "post-gen")
                                {
                                    // console.log('here3');
                                    in_html += `<br><br><span class="title-bot end-num">Select number of posts to generate for each image, maximum 5 posts total (so 1x5 or 2x2). If more is selected it will be reduced internally.</span>`;
                                    in_html += `<input type="number" class="num-posts-inp" placeholder="" min="1" max="5" value="1" id="num-posts-chat">`;
                                }

                                responseBox.innerHTML = `
                                    <p class="title-bot"><strong>LLM Chatbot:</strong><br>${subtitle}</p>
                                    <br>
                                    <p class="bot-resp" id="bot-output-stream"> ${in_html}</p>`;
                                container.appendChild(responseBox);
                                responseBox = document.getElementsByClassName('chats-bot');
                                responseBox = responseBox[responseBox.length - 1];
                                // Auto-scroll
                                setTimeout (() => {
                                    const scrollPosition = responseBox.offsetTop + responseBox.offsetHeight + 80;
                                    // console.log(scrollPosition);
                                    window.scrollTo({
                                        top: scrollPosition,
                                        behavior: 'smooth'
                                    });
                            }, 0);       
                            }

                            else{
                                responseBox = document.getElementsByClassName('chats-bot');
                                responseBox = responseBox[responseBox.length - 1];
                                streamBox = responseBox.querySelector("#bot-output-stream");
                                a = buffer.replace(/\n/g, '<br>').replace(/\[/g, '');
                                if (use_case === "img-prompt-gen")
                                {
                                    a = a.split(']');
                                    a = a.slice(0, -1);
                                }
                                else
                                {
                                    b = a.split('],');
                                    if (b.length <= 1 && use_case === "question-gen")
                                    {
                                        b = a.split('",');
                                        if (b.length <= 1)
                                        {
                                            b = a.split("',");
                                        }
                                    }
                                    a = b;
                                }
                                in_html = '';
                                for (let i = 0; i < a.length; i++)
                                {
                                    if (use_case === "prompt-gen")
                                    {
                                        in_html += `<span role="textbox" class="question_${idx}" id="question_${i}" style="cursor: text;" contenteditable> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                        continue;
                                    }
                                    if (use_case === "img-prompt-gen")
                                    {
                                        in_html += `<span role="textbox" class="question_${idx}" id="question_${i}" style="cursor: text;" contenteditable> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                    else if (use_case === "post-gen"){
                                        in_html += `<span role="textbox" class="question_${idx}" id="question_${i}" contenteditable> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                    else{
                                        in_html += `<span class="question_${idx}" id="question_${i}"> ${strip(a[i].replace(/\]/g, ''), `[],"' `)}</span>`;
                                    }
                                }
                                
                                in_html += `<button class="send-button-${button_id_type} send-button">Send</button>`;
                                if (!(use_case === "question-gen"))
                                {
                                    in_html += `<button class="reset-button-${button_id_type} reset-button">Reset</button>`;
                                }
                                if (use_case === "question-gen" || use_case === "post-gen"){
                                    in_html += `<button class="select-button-${button_id_type} select-button">Select all</button>`;
                                }   
                                
                                if (use_case === "post-gen")
                                {                                
                                    // console.log('here4');
                                    in_html += `<br><br><span class="title-bot end-num">Select number of posts to generate for each image, maximum 5 posts total (so 1x5 or 2x2). If more is selected it will be reduced internally.</span>`;
                                    in_html += `<input type="number" class="num-posts-inp" placeholder="" min="1" max="5" value="1" id="num-posts-chat">`;
                                }
                                
                                streamBox.innerHTML = `${in_html}`;
                                // Auto-scroll
                                const scrollPosition = responseBox.offsetTop + responseBox.offsetHeight + 80;
                                window.scrollTo({
                                    top: scrollPosition,
                                    behavior: 'smooth'
                                });  
                                setTimeout (() => {
                                    const scrollPosition = responseBox.offsetTop + responseBox.offsetHeight + 80;
                                    // console.log(scrollPosition);
                                    window.scrollTo({
                                        top: scrollPosition,
                                        behavior: 'smooth'
                                    });
                            }, 0);  
                            }
                            readStream();
                        });
                    }

                    readStream();
                }
                // document.getElementById('response-container').style.display = 'block';
                // document.getElementById('gptResponse').textContent = data.response;
            })
            .catch((error) => {
            console.error('Error:', error);
            reject(error);
            });

            return 1;
        });
    }

    document.getElementById('sendButton').addEventListener('click', 
    async function(event) {
        event.preventDefault();  // Prevent default behavior
        running = 1;
        // Auto-scroll
        setTimeout (() => {
            const scrollPosition = document.body.scrollHeight;
            // console.log(scrollPosition);
            window.scrollTo({
                top: scrollPosition,
                behavior: 'smooth'
            });
    }, 0); 
        disable_send();
        if (!(document.getElementById('out-settings').style.display === 'none' || document.getElementById('out-settings').style.display === '')){
            document.getElementById('settings-icon').click();
        }
        await sendGptRequest("question-gen",0);
        enable_send();
        running = 0;
        pickquestions(0,1);
    });

    document.getElementById('settings-icon').addEventListener('click', (event) => {
        if (document.getElementById('out-settings').style.display === 'none' || document.getElementById('out-settings').style.display === ''){
            document.getElementById('out-settings').style.display = 'block';
        } 
        else {
            document.getElementById('out-settings').style.display = 'none';
        }
    });

    window.addEventListener('resize', function() {
        this.document.getElementById("responses").style.marginBottom = (parseInt(this.document.getElementById("chat-bot-input-form").offsetHeight)+12.32) + 'px';
    });
});
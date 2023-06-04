interface typeInfo {
    [key: string]: string | Array<string> | boolean;
} 

// https://velog.io/@rkio/Typescript-React%EC%97%90%EC%84%9C-interface%EB%A5%BC-export-import-%ED%95%A0-%EB%95%8C

// ChatReq Options
const afterPrompt1 = 'In this article, create 10 english words and Korean meanings that Korean high school students should know., bullet points.'
const afterPrompt2 = 'In this article, make the topic sentence into one sentence of not more than 10 words, and write four more sentences, which should be a sentence, not a topic sentence.  And let each sentence be distinguished by numbering it.'
const afterPrompt3 = 'summarize the text less than 20 words, bullet points'
const afterPrompt4 = 'Create and answer three specific questions that would allow someone reading this article to check their understanding of the content. And number each question so you can tell them apart.'

export const IObjType : typeInfo = 
{ 
    loading:false,      
    draftword:"",
    newsItems:[],
    suggestedKeywords:[],
    selectedKeywords:[],
    subjectListFromGPT:[],
    subject:"",
    adjustSubject: "",
    send_article_contents:"",
    article_contents: "",
    sub1_contents: "",
    sub2_contents: "",
    sub3_contents: "",
    sub4_contents: "",
    sub5_contents: "",
    sub6_contents: "",
    sub7_contents: "",
    sub8_contents: "",
    sub9_contents: "",
    sub1_prompt: afterPrompt1,
    sub2_prompt: afterPrompt2,
    sub3_prompt: afterPrompt3,
    sub4_prompt: afterPrompt4,
    sub5_prompt: "sub5_prompt",
    sub6_prompt: "sub6_prompt",
    sub7_prompt: "",
    sub8_prompt: "",
    sub9_prompt: "",
};

import React, { useState } from "react"
import ReactMarkdown from "react-markdown"
import gfm from "remark-gfm"
import { Configuration, OpenAIApi } from "openai"

export default function Home() {
  const [markContent, setMarkContent] = useState<string>('')
  const [answers, setAnswers] = useState<string[]>([])
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_CHAT_OPENAI_KEY
  });
  const openai = new OpenAIApi(configuration);
  const NAME = "fileupload"
  const fileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      if (file.type === "text/markdown" || file.type === "text/plain") {
        const reader = new FileReader()
        reader.onload = (e) => {
          const content = e.target?.result
          if (typeof content === "string") {
            setMarkContent(content)
          }
        }
        reader.readAsText(file, "utf-8")
      } else {
        alert("Please select a Markdown or text file.")
      }
    }
  }

  const getAnswer = async () => {
    console.log(markContent)
    try {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: markContent,
        max_tokens:4097
      });

      setAnswers([...answers, String(completion.data.choices[0].text)]);
    } catch (e) {
      console.log("errors", e);
    }
  }
  const change = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkContent(e.target.value)
  }

  return (
    <>
    <main>
      <div>
        <input
          type="file"
          accept=".md, text/plain"
          id={NAME}
          className="h-0 opacity-0"
          onChange={fileUpload}
        />
        <div className="flex flex-col m-auto gap-10">
          <label htmlFor={NAME}>
            <div className="border-primary flex h-[46px] w-[196px] cursor-pointer rounded border-2 object-cover hover:opacity-50 m-auto">
              <span className="text-primary mt-[10px] m-auto">fileUpload</span>
            </div>
          </label>
          <div className="flex flex-row gap-[10rem] m-auto w-full h-[70vh] px-4">
            <textarea
              className="border-2 w-[70%] p-2"
              onChange={change}
              value={markContent}
            ></textarea>
            <div className="border-primary flex h-[46px] w-[196px] cursor-pointer rounded border-2 object-cover hover:opacity-50 m-auto" onClick={getAnswer}>
              <span className="text-primary mt-[10px] m-auto">convert</span>
            </div>
            <div className="border-2 w-[70%] p-2 overflow-auto">
              <ReactMarkdown remarkPlugins={[gfm]}>{markContent}</ReactMarkdown>
              {/* {answers.map((answer) => <span>{answer}</span>)} */}
            </div>
          </div>
        </div>
      </div>
    </main>
    </>
  );
}

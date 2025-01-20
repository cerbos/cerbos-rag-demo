export async function loader() {
  return {};
}
export default function Chat() {
  return (
    <div className="w-10/12 mx-auto flex flex-col gap-10 min-h-screen max-h-screen">
      <h1 className="font-bold text-4xl py-4">Prompt</h1>
      <code>
        <pre>
          {`
You are an assistant for question-answering tasks. 
Use the following pieces of retrieved context to answer the question. 

Use three sentences maximum and keep the answer concise. 

Question: {question} 

Context: {context} 

My Username is {username}
My User ID is {userId}
My roles are {roles}
My department is {department}
My region is {region}

The current time is {time}

Answer: `}
        </pre>
      </code>
    </div>
  );
}

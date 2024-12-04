import { json } from "@remix-run/node";

export async function loader() {
  return json({});
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

If the user role is MANAGER and department in SALES then they can only approve an expense if it is in the same region as them.
If the user department is IT then they can access all expenses regardless of region.
A user can't approve their own expenses unless they have the ADMIN role

Answer: `}
        </pre>
      </code>
    </div>
  );
}
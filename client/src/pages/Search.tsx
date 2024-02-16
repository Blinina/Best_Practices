import React, { useState } from "react"
import { Joke } from "../models/IJoke"

const BASE_API = "https://api.chucknorris.io/jokes/search?query="

type CorrectResponse = {
  result: Joke[]
  total: number
}

export const Search = () => {
  const [inputValue, setInputValue] = useState("")
  const [jokes, setJokes] = useState<Joke[]>([])
  const [countResult, setCountResult] = useState(0)

  function isCorrectResponse(arg: CorrectResponse | unknown): arg is CorrectResponse {
    return (arg as CorrectResponse).total !== undefined
  }
  const handlerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }
  const getJokes = async (query: string) => {
    const res = await fetch(BASE_API + query)
    if (!res.ok) throw new Error("error")
    const json = await res.json()
    if (!isCorrectResponse(json)) throw new Error("TypeError")
    return json
  }

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const { result, total } = await getJokes(inputValue)
      setJokes(result)
      setCountResult(total)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <form onSubmit={handlerSubmit}>
        <input
          id="search"
          type="text"
          value={inputValue}
          onChange={handlerChange}
          placeholder="Search jokes..."
        />
      </form>
      <div>
        <ul>
          {jokes?.map((el) => (
            <li key={el.id}>
              <JokeCard />
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export type TypePost = {
  id: number
  title: string
  content: string
}

export type TypeData = {
  POSTS: TypePost[]
}

export const DATA: TypeData = {
  POSTS: [
    {
      id: 1,
      title: 'title1',
      content: 'content1',
    },
    {
      id: 2,
      title: 'title2',
      content: 'content2',
    }
  ]
}

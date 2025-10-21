export type TypePost = {
  id: number
  title: string
}

export type TypeData = {
  POSTS: TypePost[]
}

export const DATA: TypeData = {
  POSTS: [
    {
      id: 1,
      title: 'post1'
    },
    {
      id: 2,
      title: 'post2'
    }
  ]
}

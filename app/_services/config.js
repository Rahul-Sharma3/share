import { Client, Account, Storage, Databases } from 'appwrite'

const client = new Client()

client
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID)

export const account = new Account(client)
export const storage = new Storage(client)
export const databases = new Databases(client)
export { client } 
import pg from 'pg'
import {
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASS,
  DB_NAME
} from './config.js'

export function getClient() {
  return new pg.Client({
    host     : DB_HOST, 
    port     : DB_PORT, 
    user     : DB_USER,
    password : DB_PASS,
    database : DB_NAME
  })
}

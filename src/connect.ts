import { feathers } from '@feathersjs/feathers'
import socketio from '@feathersjs/socketio-client'
import authentication from '@feathersjs/authentication-client'
import { io } from "socket.io-client";
import { history } from 'umi'
import { URL } from '@/URL';

/* global io, feathers, moment */
// Establish a Socket.io connection
const socket = io(URL)
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const client = feathers();

client.configure(socketio(socket, { secure: true }))
// Use localStorage to store our login token
client.configure(authentication())

client.hooks({
    error: [
        context => {
            if(context.error?.code === 401) {
                // reauth
                client.reAuthenticate().then(res => {
                    console.log('res => ', res)
                })
            }
        }
    ]
})

export default client;
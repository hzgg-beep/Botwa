const {
 default: makeWASocket,
 useMultiFileAuthState
} = require("@whiskeysockets/baileys")

const P = require("pino")

async function startBot(){

 const { state, saveCreds } =
 await useMultiFileAuthState("session")

 const sock = makeWASocket({
  auth: state,
  logger: P({ level: "silent" }),
  printQRInTerminal: true
 })

 sock.ev.on("creds.update", saveCreds)

 sock.ev.on("connection.update",
 ({ connection }) => {

  if(connection === "open"){
   console.log("BOT CONNECTED ✅")
  }

 })

 sock.ev.on("messages.upsert",
 async ({ messages }) => {

  const msg = messages[0]

  if(!msg.message) return

  const text =
   msg.message.conversation ||
   msg.message.extendedTextMessage?.text

  if(text === "ping"){

   await sock.sendMessage(
    msg.key.remoteJid,
    { text: "pong 🗿" }
   )

  }

 })

}

startBot()

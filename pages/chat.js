import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import React, { useState } from "react";
import appConfig from "../config.json";

export default function ChatPage() {
  const [mensagem, setMensagem] = useState("");
  const [listMensagem, setListMensagem] = useState([]);

  /*
  Sua lógica vai aqui
  -- mensagem escrita do usuario textarea
  -- enter para enviar
  -- adicionar a menssagem na listagem

  dev:
  -- campo de mensagem [states]
  -- usar o onChange e o useState (ter if caso seja enter pra limpar a variavel)
  -- lista de mensagens

  ./Sua lógica vai aqui
  */

  function handleKeyPress(newMensagem) {
    const mensagem = {
      id: listMensagem.length + 1,
      from: "leoopl",
      text: newMensagem,
    };
    setListMensagem([mensagem, ...listMensagem]);
    setMensagem("");
  }

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        //backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(chat-background.gif)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "85%",
          maxWidth: "70%",
          maxHeight: "80vh",
          padding: "32px",
          opacity: 0.85,
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList
            mensagens={listMensagem}
            setListMensagem={setListMensagem}
          />

          {/* {listMensagem.map((mensagemAtual) => {
            return (
              <li key={mensagemAtual.id}>
                {mensagemAtual.from}: {mensagemAtual.text}
              </li>
            );
          })} */}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(e) => {
                setMensagem(e.target.value);
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleKeyPress(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />

            <Button
              onClick={(e) => {
                e.preventDefault();
                handleKeyPress(mensagem);
              }}
              disabled={mensagem.length < 1}
              label="Send"
              variant="tertiary"
              colorVariant="light"
              rounded="full"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Image
          styleSheet={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
          }}
          src={`https://github.com/leoopl.png`}
        />
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  // console.log("MessageList", props);

  function handleDelete(id) {
    const deleteMsg = props.mensagens.filter((mensagem) => mensagem.id !== id);
    console.log(deleteMsg);
    props.setListMensagem(deleteMsg);
  }

  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/leoopl.png`}
              />
              <Text tag="strong">{mensagem.from}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
              <Box
                styleSheet={{
                  margin: "14px",
                  display: "inline-block",
                  position: "absolute",
                  alignSelf: "center",
                  width: "14px",
                  right: "24px",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(mensagem.id);
                }}
              >
                <Icon name="FaTrash" />
              </Box>
            </Box>
            {mensagem.text}
          </Text>
        );
      })}
    </Box>
  );
}

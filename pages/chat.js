import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { Popover, Avatar, StyledBadge } from "@mui/material";

const SUBABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5MzY3NywiZXhwIjoxOTU4ODY5Njc3fQ.slHZkWYaJXLdEZJXoQdj-LQhO6W7DlDYP_Zv2K0deNs";
const SUBABASE_URL = "https://mfjugxthqktjnncajdvc.supabase.co";
const supabaseClient = createClient(SUBABASE_URL, SUBABASE_ANON_KEY);

export default function ChatPage() {
  const [mensagem, setMensagem] = useState("");
  const [listMensagem, setListMensagem] = useState([]);
  const [popUp, setPopUp] = useState(null);
  const open = Boolean(popUp);

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

  useEffect(() => {
    supabaseClient
      .from("Mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        //console.log("roda tudo ai", data);
        setListMensagem(data);
      });
  }, []);

  function handleKeyPress(newMensagem) {
    const mensagem = {
      //id: listMensagem.length + 1,
      from: "leoopl",
      text: newMensagem,
    };

    supabaseClient
      .from("Mensagens")
      .insert([mensagem])
      .then(({ data }) => {
        setListMensagem([data[0], ...listMensagem]);
      });

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
            popUp={popUp}
            setPopUp={setPopUp}
            open={open}
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
              {/* ___________________________________ */}

              <Avatar
                aria-owns={open ? "mouse-over-popover" : undefined}
                aria-haspopup="true"
                onMouseEnter={(e) => {
                  props.setPopUp(
                    // gambiarras feelings
                    e.currentTarget.children[0].src
                      .split("com/")[1]
                      .split(".")[0]
                  );
                }}
                onMouseLeave={() => {
                  props.setPopUp(null);
                }}
                alt="Remy Sharp"
                src={`https://github.com/${mensagem.from}.png`}
              />

              <Popover
                open={props.open}
                id="mouse-over-popover"
                sx={{
                  pointerEvents: "none",
                }}
                open={props.open}
                anchorEl={props.popUp}
                anchorOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "center",
                  horizontal: "center",
                }}
                onClose={() => {
                  props.setPopUp(null);
                }}
                disableRestoreFocus
                transitionDuration={(100, 100, 0)}
              >
                <Avatar
                  variant="rounded"
                  sx={{ width: 200, height: 200 }}
                  alt="Remy Sharp"
                  src={`https://github.com/${props.popUp}.png`}
                />
              </Popover>
              {/* ___________________________________ */}
              {/* <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.from}.png`}
              /> */}
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

import {
  Box,
  Text,
  TextField,
  Image,
  Button,
  Icon,
} from "@skynexui/components";
import React, { useState, useEffect } from "react";
import appConfig from "../config.json";
import { createClient } from "@supabase/supabase-js";
import { Popover, Avatar, StyledBadge } from "@mui/material";
import { useRouter } from "next/router";
import { ButtonSendSticker } from "../src/components/ButtonSendSticker";
import SendIcon from "@mui/icons-material/Send";

const SUBABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzI5MzY3NywiZXhwIjoxOTU4ODY5Njc3fQ.slHZkWYaJXLdEZJXoQdj-LQhO6W7DlDYP_Zv2K0deNs";
const SUBABASE_URL = "https://mfjugxthqktjnncajdvc.supabase.co";
const supabaseClient = createClient(SUBABASE_URL, SUBABASE_ANON_KEY);

export default function ChatPage() {
  const router = useRouter();
  const currentUser = router.query.username;
  const [mensagem, setMensagem] = useState("");
  const [listMensagem, setListMensagem] = useState([]);
  const [popUp, setPopUp] = useState(null);
  const open = Boolean(popUp);

  function realTimeMensage(addNewMensage) {
    return supabaseClient
      .from("Mensagens")
      .on("INSERT", (realTime) => {
        addNewMensage(realTime.new);
      })
      .subscribe();
  }

  useEffect(() => {
    supabaseClient
      .from("Mensagens")
      .select("*")
      .order("id", { ascending: false })
      .then(({ data }) => {
        //console.log("roda tudo ai", data);
        setListMensagem(data);
      });
    realTimeMensage((newMensage) => {
      setListMensagem((currentListValue) => {
        return [newMensage, ...currentListValue];
      });
    });
  }, []);

  function handleKeyPress(newMensagem) {
    const mensagem = {
      //id: listMensagem.length + 1,
      from: currentUser,
      text: newMensagem,
    };

    supabaseClient
      .from("Mensagens")
      .insert([mensagem])
      .then(({ data }) => {
        // setListMensagem([data[0], ...listMensagem]);
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
        <Header currentUser={currentUser} />
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
            currentUser={currentUser}
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
            ></TextField>
            {/* COLOCAR O BOTÃO DE SEND DENTRO DA CAIXA DE MENSAGEM ------------------------------------------------- */}

            <Button
              styleSheet={{
                borderRadius: "50%",
                padding: "0 3px 0 0",
                minWidth: "50px",
                minHeight: "50px",
                fontSize: "20px",
                marginBottom: "8px",
                lineHeight: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: appConfig.theme.colors.neutrals[300],
                hover: {
                  filter: "grayscale(0)",
                },
                left: "-5px",
              }}
              onClick={(e) => {
                e.preventDefault();
                handleKeyPress(mensagem);
              }}
              disabled={mensagem.length < 1}
              label={<SendIcon />}
              variant="tertiary"
              colorVariant="light"
              rounded="full"
            />

            <ButtonSendSticker
              onStickerClick={(sticker) => {
                handleKeyPress(":sticker:" + sticker);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header(props) {
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
          src={`https://github.com/${props.currentUser}.png`}
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
                onClick={() => {
                  location.href = `https://github.com/${props.popUp}`;
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

              <Icon
                name="FaTrash"
                styleSheet={{
                  display:
                    props.currentUser === mensagem.from ? "block" : "none",
                  marginLeft: "auto",
                  marginRight: ".7rem",
                  transition: ".4s ease all",
                  cursor: "pointer",
                  hover: {
                    color: "grey",
                  },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(mensagem.id);
                }}
              />
            </Box>
            {mensagem.text.startsWith(":sticker:") ? (
              <Image src={mensagem.text.replace(":sticker:", "")} />
            ) : (
              mensagem.text
            )}
          </Text>
        );
      })}
    </Box>
  );
}

import { Box, Button, Text, TextField, Image } from "@skynexui/components";
import appConfig from "../config.json";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
//import { useFormik } from "formik";

function Title(props) {
  const Tag = props.tag || "h1";
  return (
    <>
      <Tag>{props.children}</Tag>
      <style jsx>{`
        ${Tag} {
          color: ${appConfig.theme.colors.primary[300]};
          font-size: 24px;
          font-weight: 600;
        }
      `}</style>
    </>
  );
}

// Componente React
// function HomePage() {
// 	// JSX
// 	return (
// 		<div>
// 			<GlobalStyle />
// 			<Title tag="h2">Boas vindas de volta!</Title>
// 			<h2>Discord - Alura Matrix</h2>
// 		</div>
// 	);
// }

// export default HomePage;

// function fetc(props) {
//   fetch(`https://github.com/${props}.png`).then((resposta) => {
//     console.log(resposta.status);
//     if (resposta.status === 404) {
//       return (question = true);
//     } else {
//       return (question = false);
//     }
//   });
// }

export default function HomePage() {
  const STANDERT_USER = "/user1.png";
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [image, setImage] = useState(STANDERT_USER);
  const router = useRouter();

  const handleChange = (e) => {
    let name = e.target.value;

    if (name.length <= 2 || name === 404) {
      //TODO: CORRIGIR A IMAGEM AO RECEBER 404 ----------------------------------------
      setImage(STANDERT_USER);
    } else {
      setImage(`https://github.com/${name}.png`);
    }
    setUsername(name);
  };

  useEffect(() => {
    if (username.length > 2) {
      fetch(`https://api.github.com/users/${username}`).then(
        async (resposta) => {
          setData(await resposta.json());
        }
      );
    }
  }, [username]);

  const handleName = () => {
    if (username.length > 2) {
      return data.name || data.login;
    } else {
      return "";
    }
  };

  return (
    <>
      <Box
        styleSheet={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: appConfig.theme.colors.neutrals[100],
          backgroundImage: "url(/background.png)",
          // backgroundImage:
          // 	"url(https://i.ibb.co/8jdSQGP/1641024405081.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
        }}
      >
        <Box
          styleSheet={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            width: "100%",
            maxWidth: "700px",
            borderRadius: "5px",
            padding: "32px",
            margin: "16px",
            //boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
            //backgroundColor: appConfig.theme.colors.neutrals[600],
          }}
        >
          {/* Formulário */}
          <Box
            as="form"
            onSubmit={function handleSubmit(e) {
              e.preventDefault();
              //passagem de pagina mais direta e leve
              router.push(`/chat?username=${username}`);
              //window.location.href = "/chat";
            }}
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: "100%", sm: "50%" },
              textAlign: "center",
              marginBottom: "32px",
            }}
          >
            <Title tag="h2">Boas vindas de volta!</Title>
            <Text
              variant="body3"
              styleSheet={{
                marginBottom: "32px",
                color: appConfig.theme.colors.neutrals[300],
              }}
            >
              {appConfig.name}
            </Text>

            <TextField
              //entrada de texto. {username}
              value={username}
              onChange={handleChange}
              fullWidth
              textFieldColors={{
                neutral: {
                  textColor: appConfig.theme.colors.neutrals[200],
                  mainColor: appConfig.theme.colors.neutrals[900],
                  mainColorHighlight: appConfig.theme.colors.primary[500],
                  backgroundColor: appConfig.theme.colors.neutrals[800],
                },
              }}
            />
            <Button
              type="submit"
              disabled={username.length < 3}
              label="Entrar"
              fullWidth
              buttonColors={{
                contrastColor: appConfig.theme.colors.neutrals["000"],
                mainColor: appConfig.theme.colors.primary[500],
                mainColorLight: appConfig.theme.colors.primary[400],
                mainColorStrong: appConfig.theme.colors.primary[600],
              }}
            />
          </Box>
          {/* Formulário */}

          {/* Photo Area */}
          <Box
            styleSheet={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "200px",
              padding: "16px",
              //backgroundColor:
              //appConfig.theme.colors.neutrals[800],
              //border: "1px solid",
              borderColor: appConfig.theme.colors.neutrals[999],
              borderRadius: "10px",
              flex: 1,
              minHeight: "240px",
            }}
          >
            <Image
              styleSheet={{
                borderRadius: "50%",
                marginBottom: "16px",
              }}
              src={image}
            />
            <Text
              variant="body4"
              styleSheet={{
                color: appConfig.theme.colors.neutrals[200],
                backgroundColor: appConfig.theme.colors.neutrals[900],
                padding: "3px 10px",
                borderRadius: "1000px",
              }}
            >
              {handleName()}
              {/* {data.name || data.login} */}
            </Text>
          </Box>
          {/* Photo Area */}
        </Box>
      </Box>
    </>
  );
}

/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../src/Link";
import ProTip from "../src/ProTip";
import Copyright from "../src/Copyright";
import RedSeaImage from "../public/background-red-sea.jpg";
import MadLiberationLogo from "../public/mad-liberation-logo.png";
import VeryAwesomePassoverLogo from "../public/VAPLogo-white.png";
import { Global, css, jsx } from "@emotion/react";
import { Paper } from "@mui/material";
import { madLiberationStyles } from "../madLiberationStyles";

export default function Home() {
  return (
    <div>
      <div
        style={{
          backgroundColor: "#81181f",
        }}
      >
        <div>
          <img
            css={{
              height: "200px",
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            src={`${MadLiberationLogo.src}`}
          ></img>
        </div>
        <Container maxWidth="md">
          <Paper>
            <div css={madLiberationStyles.lightGrayBackround}>Gray??</div>
            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              on paper
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              nec ullamcorper orci. Morbi sodales dolor nec tortor ultricies,
              sit amet semper purus maximus. Duis tempor tincidunt mauris in
              egestas. Sed nec magna euismod, commodo magna at, laoreet sapien.
              Duis posuere velit ex, non varius nunc egestas vitae. Nulla
              facilisi. Sed iaculis pulvinar fringilla. Mauris nec hendrerit
              diam. Nam imperdiet placerat nibh et condimentum. Nulla viverra
              condimentum felis, id tristique ligula egestas vitae.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Mauris sit amet elit posuere, porta ex nec, egestas nulla. Quisque
              ac quam consequat, scelerisque leo sit amet, consequat nunc. Sed
              malesuada ligula ut malesuada pulvinar. Maecenas sit amet ante non
              orci pulvinar ultricies. Proin sed varius est. Mauris purus
              tellus, aliquam id tellus sit amet, tempor ornare dui. Proin in
              efficitur lorem. Cras nibh ipsum, eleifend a tristique at, feugiat
              a dolor. Praesent sed nibh ac nunc auctor scelerisque dapibus sed
              quam. Quisque vel nulla nibh. Quisque ac blandit massa.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Mauris sollicitudin venenatis nulla eu consequat. Pellentesque
              tristique leo magna, nec aliquet nulla rutrum vel. Donec sed dolor
              ut orci malesuada porttitor. In ut blandit lorem. Vestibulum
              dictum orci id leo commodo consectetur. Sed lobortis nisi id
              tincidunt rutrum. Vivamus purus ipsum, egestas et ante a,
              malesuada dignissim eros. Vestibulum felis nunc, scelerisque id
              dignissim sit amet, accumsan sit amet augue. Vivamus elementum,
              nibh consequat egestas iaculis, magna velit condimentum massa, non
              dignissim velit leo quis tellus. Morbi vel eleifend mauris, sed
              volutpat nisi. Duis ut erat neque. Integer elit nisi, fermentum
              vel blandit placerat, ornare sit amet est. Quisque laoreet tortor
              et est rutrum fermentum. Vestibulum fermentum, ex non venenatis
              imperdiet, risus leo sagittis augue, sit amet facilisis massa
              lacus sed est. Sed sagittis tempus tincidunt. Integer bibendum
              ligula quis velit tincidunt porta.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Sed hendrerit diam sed tincidunt malesuada. Pellentesque eu
              vehicula sapien. Cras sapien neque, ullamcorper placerat dignissim
              maximus, bibendum ac dui. Duis lorem est, egestas id est
              malesuada, feugiat iaculis libero. Cras et nunc condimentum,
              dictum enim id, facilisis nunc. Suspendisse orci ipsum, convallis
              at tincidunt in, efficitur et odio. Quisque nec laoreet magna,
              quis porttitor urna. Fusce ac rhoncus tellus, nec accumsan nibh.
              Nunc non euismod ex. Fusce pharetra felis quis elit convallis, at
              pellentesque ipsum iaculis. Pellentesque accumsan nec nibh at
              ultrices.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Nunc dapibus magna eu massa vestibulum, sed ultricies lacus
              posuere. Proin nec finibus augue. Vestibulum ac pellentesque erat.
              Donec eu purus vitae eros dignissim dictum sit amet non nisi.
              Integer tempor ultrices tempor. Nullam imperdiet accumsan elit, eu
              condimentum diam euismod et. Aliquam nisl quam, lobortis vel metus
              quis, tincidunt semper erat. Curabitur ornare, arcu vel interdum
              dignissim, arcu dui malesuada quam, sed finibus tellus nunc sit
              amet turpis. Curabitur laoreet nisl at nisi consequat sodales.
              Vestibulum condimentum feugiat efficitur. Mauris ante nisl,
              pretium id vestibulum ut, faucibus vel risus. Proin a tellus sed
              nisi pulvinar faucibus varius sollicitudin est. Fusce iaculis
              efficitur ultrices. Cras sit amet euismod elit, id consectetur
              dui. Sed vel pretium urna, eu porttitor dui.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Maecenas sit amet neque pellentesque, laoreet elit aliquet,
              consectetur tellus. Fusce id pellentesque nulla. Aliquam luctus
              diam in mauris feugiat, at finibus urna rhoncus. Morbi vel justo
              massa. Fusce molestie est nec magna molestie ultricies. Proin
              laoreet lacus ac ipsum elementum, quis vehicula enim scelerisque.
              Cras eget dolor quam. Proin malesuada facilisis sapien, ut egestas
              justo viverra nec. Nunc scelerisque rutrum ligula volutpat
              maximus. Nullam eu finibus mi, eu condimentum lorem. Sed eros
              diam, accumsan sed cursus nec, semper nec libero. Cras commodo
              libero vel dui venenatis sagittis.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Phasellus placerat, ipsum quis tristique cursus, augue tortor
              bibendum dolor, et consectetur erat mauris in mi. Quisque vel
              tellus elit. Aliquam pretium, felis eget lacinia ultricies, felis
              odio aliquam turpis, vitae tincidunt dui velit ac elit. Praesent
              id feugiat ligula, id feugiat urna. Sed id leo vitae massa euismod
              malesuada. Nunc varius accumsan nisl in tincidunt. Maecenas
              rhoncus felis non libero blandit, ut fringilla nunc ultricies.
              Phasellus varius orci a purus blandit volutpat. Aenean est nibh,
              maximus eget maximus ac, vulputate eget elit. Aenean interdum
              varius maximus. Praesent a mi pharetra, vulputate sem non, varius
              nisl. Morbi elit justo, accumsan vitae ultricies non, facilisis
              vitae erat.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Curabitur pulvinar lorem nisi, nec malesuada ante consequat eu.
              Maecenas neque lectus, ultricies sed semper ac, porta vitae metus.
              Nullam vel risus tortor. Praesent fringilla lectus ac nisl mollis,
              non dignissim nibh tempor. Integer sollicitudin viverra turpis
              tempor tincidunt. Nullam hendrerit mi non tempor laoreet. Donec
              sed sodales dolor.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Donec sed feugiat nisl, eu auctor erat. Donec nibh purus, bibendum
              bibendum ipsum vel, imperdiet tincidunt dolor. Donec urna risus,
              porttitor et orci eu, maximus eleifend eros. Proin eu lacinia
              lorem, eu tempus ipsum. Sed laoreet sapien a ex placerat, ac
              finibus nulla pulvinar. Vivamus auctor consectetur augue mattis
              condimentum. In bibendum quam eu dolor consectetur dignissim.
              Donec sagittis gravida turpis quis egestas. Aliquam lacinia
              blandit augue, tincidunt gravida odio rhoncus in.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Nulla elementum turpis eu sapien molestie commodo. Donec nec ante
              consequat, elementum est ut, venenatis metus. Fusce leo augue,
              molestie a ex eget, sagittis posuere neque. Maecenas libero
              libero, suscipit vitae risus et, maximus auctor magna. Proin
              rutrum odio purus, at condimentum nisi pretium quis. Donec mattis
              ligula sodales, fringilla augue non, tristique dui. Sed cursus
              scelerisque sagittis. Integer tempor placerat dolor, pulvinar
              pharetra massa auctor sit amet.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia curae; Suspendisse auctor sem at lorem placerat
              gravida. Integer vitae dictum ex. Vestibulum imperdiet turpis sit
              amet feugiat venenatis. Nam vel euismod libero, vitae interdum
              risus. Fusce blandit vestibulum metus sit amet viverra. Donec eget
              pellentesque nulla. Quisque eget tellus eleifend, semper nisl
              vitae, maximus ligula. Duis ultricies aliquet faucibus.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Nam blandit tincidunt porttitor. Etiam posuere arcu at felis
              sollicitudin faucibus. Interdum et malesuada fames ac ante ipsum
              primis in faucibus. Pellentesque dolor odio, egestas a est ac,
              iaculis pharetra libero. Vestibulum eget lorem congue enim
              hendrerit mattis. Vestibulum vitae risus ut tellus dapibus
              tristique quis sit amet eros. Cras non venenatis metus. Sed
              accumsan varius neque nec finibus. Ut feugiat cursus nisi in
              accumsan. Maecenas id erat maximus, aliquam sem at, tincidunt
              lorem. Pellentesque condimentum sem a interdum convallis. Duis
              ullamcorper tellus et viverra suscipit. Vivamus suscipit mattis
              neque ut suscipit. Vestibulum blandit neque sed nisi imperdiet
              convallis.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Donec laoreet est dui, sed aliquet risus congue id. Mauris aliquam
              a justo ac lacinia. Donec in gravida eros. Donec condimentum sit
              amet nisi vitae egestas. Cras condimentum, libero sit amet
              vulputate placerat, mauris nibh vehicula magna, vel finibus ligula
              quam at urna. Donec a lobortis lorem. Vestibulum ante ipsum primis
              in faucibus orci luctus et ultrices posuere cubilia curae; Nam
              quis lectus in erat faucibus tempor a vitae lorem. Aenean ut
              tempor libero. Nulla consectetur odio at dui iaculis laoreet. In
              elit lectus, dapibus eu sapien ut, pharetra ullamcorper justo.
              Maecenas ac egestas massa. In consectetur diam sem, a euismod
              nulla pellentesque eget.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Pellentesque porttitor lacus sed lectus luctus scelerisque.
              Vivamus id turpis sit amet arcu rhoncus tempus. Vestibulum
              faucibus nulla nec erat euismod scelerisque. Fusce risus diam,
              congue eget sagittis cursus, dapibus sit amet risus. Integer
              sagittis at leo in lobortis. Curabitur sit amet sodales tellus.
              Proin bibendum est quis magna commodo accumsan id et metus. Donec
              facilisis magna purus, sit amet interdum nibh consequat et.
            </Typography>

            <Typography
              variant="body1"
              component="p"
              gutterBottom
              css={madLiberationStyles.typography}
            >
              Aliquam vitae ornare lorem. Etiam suscipit, ex sit amet laoreet
              viverra, mi orci congue risus, at sagittis nulla lacus id nunc. In
              dapibus felis eget libero dapibus, eu auctor eros pellentesque.
              Interdum et malesuada fames ac ante ipsum primis in faucibus.
              Praesent luctus enim enim, at aliquam dolor varius a. Suspendisse
              pellentesque diam in erat sagittis, sit amet consequat felis
              condimentum. Sed a mollis magna, et sodales massa. Nullam
              venenatis aliquet risus. Ut molestie sapien ac euismod dignissim.
            </Typography>
          </Paper>
        </Container>
        <img
          css={{
            height: "70px",
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
          }}
          src={`${VeryAwesomePassoverLogo.src}`}
        ></img>
      </div>
    </div>
  );
}

// types
import { FC } from '../../types'


// mui
import {
  Typography,
} from '@mui/material'

import MuiMarkdown from 'mui-markdown';
import theme from "prism-react-renderer/themes/github";

export interface MarkdownProps {
  content: string
}

const Markdown: FC<MarkdownProps> = (props) => {

  const enhance = (md: string) => {
    const lines = ["", ...md.split("\n"), ""]

    let isBlock = false
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i]

      // add breakline before and after code blocks
      if (line.startsWith("```")) {
        if (isBlock) {
          isBlock = false
          lines[i + 1] = lines[i + 1] + "\n<br>"
        } else {
          isBlock = true
          lines[i - 1] = lines[i - 1] + "\n<br>"
        }
      }

      // add brealine before blockquote
      if (line.startsWith(">") && !lines[i - 1].startsWith(">")) {
        lines[i - 1] = lines[i - 1] + "\n<br>"
      }

      // add brealine after blockquote
      if (line.startsWith(">") && !lines[i + 1].startsWith(">")) {
        lines[i + 1] = lines[i + 1] + "\n<br>"
      }

      // add emoji to link (as there is no text decoration)
      const link = line.match(/\[(.+)\]\(.+\)/)
      if (link !== null) {
        const idx = line.indexOf(link[1]) + link[1].length
        lines[i] = line.slice(0, idx) + " (🔗)" + line.slice(idx)
      }

    }

    return lines.reduce((p, v) => p + "\n" + v, "")
  }

  return (
    <MuiMarkdown
      options={{
        overrides: {
          h1: {
            component: Typography,
            props: {
              variant: "h2",
              sx: { mb: 2, mt: 2 }
            },
          },
          a: {
            props: {
              style: { textDecoration: "none" }
            }
          },
          h2: {
            component: Typography,
            props: {
              variant: "h3",
              sx: { mb: 2, mt: 3 }
            },
          },
          h3: {
            component: Typography,
            props: {
              variant: "h4",
              sx: { mb: 1, mt: 3 }
            },
          },
          h5: {
            component: Typography,
            props: {
              sx: {
                fontSize: 6,
                color: "rgba(255,255,255,0)"
              }
            },
          },
          code: {
            props: {
              style: {
                backgroundColor: "rgba(126, 126, 126, 0.1)",
                borderRadius: "4px",
                color: "currentcolor",
                padding: "0.1rem 0.2rem",
              },
            },
          },
          li: {
            component: Typography,
            props: {
              variant: "body1",
              component: "li",
            },
          },
        },
        forceBlock: true
      }}
      codeBlockTheme={theme}
    >
      {enhance(props.content)}
    </MuiMarkdown>
  )
}

export default Markdown
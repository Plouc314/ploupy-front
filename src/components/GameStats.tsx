// next
import { useRouter } from 'next/router'

// react
import { useState } from 'react'

// types
import { FC, IGame } from '../../types'

// mui
import {
  Avatar,
  Collapse,
  IconButton,
  List,
  ListItem,
  Box,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Tabs,
  Tab,
} from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

// chart js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Scatter } from 'react-chartjs-2';
import { COLORS } from '../pixi/constants';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

type StatsType = keyof Omit<IGame.GamePlayerStats, "username">

export interface GameStatsProps {
  data: IGame.GamePlayerStats[]
}

const GameStats: FC<GameStatsProps> = (props) => {

  const [show, setShow] = useState<StatsType>("money")

  const categories = ["money", "occupation", "factories", "turrets", "probes"]

  return (
    <>
      <Tabs
        value={show}
        onChange={(e, value) => {
          setShow(value as StatsType)
        }}
      >
        {categories.map(c => (
          <Tab
            key={`tab-${c}`}
            label={c}
            value={c}
          />
        ))}
      </Tabs>
      <Scatter
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top' as const,
            },
          },
          scales: {
            xAxis: {
              axis: "y",
              suggestedMin: 0,
            }
          }
        }}
        data={{
          datasets: props.data.map((stat, i) => ({
            label: stat.username,
            data: stat[show].map((v, i) => ({ x: i, y: v })),
            borderColor: COLORS[i].toString(),
            backgroundColor: COLORS[i].toString(),
            showLine: true,
            pointRadius: 0,
          }))
        }}
      />
    </>
  )
}

export default GameStats
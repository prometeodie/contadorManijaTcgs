import { ChessConfig } from "./chess-config.interface";

export interface ConfigurationData {
  hpValue: number;
  roundTimerDuration: string;
  turnTimerDuration: string;
  chessTimerConfig: ChessConfig;
  roundTimerEnabled: boolean;
  turnTimerEnabled: boolean;
  player1Color: string;
  player2Color: string;
  threeMatches: boolean;
}

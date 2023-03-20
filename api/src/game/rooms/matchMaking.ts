import { Room, Client } from "colyseus";
import { IncomingMessage } from "http";

interface MatchmakingGroup {
    averageRank: number;
    clients: ClientStat[],
    priority?: boolean;
    ready?: boolean;
    confirmed?: number;
  }
  
  interface ClientStat {
    client: Client;
    waitingTime: number;
    options?: any;
    group?: MatchmakingGroup;
    rank: number;
  }


export class matchMaking extends Room 
{
    id = 0;
    onCreate(options: any)
    {
      console.log("match making room ready");
    }
    onAuth(client: Client, options: any, request?: IncomingMessage) 
    {
      client.sessionId = "player " + this.id;
      this.id++;
      return true;
    }
    onJoin(client: Client, options: any)
    {
      //recupere le client et l'ajouter au groupe d attente
      console.log(client.sessionId + " est connecter !")
      this.matchPlayer();
    }

    matchPlayer()
    {
      //parcoure le groupe d attente
      //comparer les ranks voir la difference entre le rank de chacun
      //Si le rank correspond je valide la partie
        //reserve une place dans la room du jeux 
        //rejoigne la room
    }
    
    onLeave(client: Client, consented: boolean)
    {
      //si room rejoins quitter matchmaking
    }
}
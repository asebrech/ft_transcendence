import { Room, Client, matchMaker } from "colyseus";
import { IncomingMessage } from "http";


interface MatchmakingGroup {
    clients: ClientStat[],
  }
//cette interface est temporaire
interface ClientStat {
  client: Client;
  waitingTime: number;
  options?: any;
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
    async onJoin(client: Client, options: any)
    {
      //recupere le client et l'ajouter au groupe d attente
      console.log(client.sessionId + " est connecter !")
      const room = await matchMaker.createRoom("my_room", {}); // cree la room pour ensuite reserve un seat 
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
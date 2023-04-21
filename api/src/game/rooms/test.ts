import { Room, Client, Delayed, matchMaker } from "colyseus";

interface grpPlayer {
  client: Client;
  options: any;
}

export class TestRoom extends Room {
  private players: grpPlayer[] = [];

  onCreate(options: any) {
    // Initialize any room state here...
    this.setSeatReservationTime(100);
  }

  async onJoin(client: Client, options: any, auth: any) {
    // Store the client and their options so we can match them with other players
    const player: grpPlayer = { client, options };
    this.players.push(player);

    // If we have enough players, match them together and create a new room
    if (this.players.length >= 2 && this.players.length % 2 === 0) {
      // Match players together
      const matchedPlayers = this.matchPlayers();

      // Create a new room for the matched players
      const newRoom = await matchMaker.createRoom("my_room", {});

      // Reserve seats for each player in the new room
      for (const player of matchedPlayers)
      {
        const matchData = await matchMaker.reserveSeatFor(newRoom, player.options);
        player.client.send("seat", {roomN : newRoom.roomId ,ticket: matchData });
      }

      // Set autoDispose to true to dispose of this room when all clients leave.
      this.autoDispose = true;
    }
  }

  private matchPlayers(): grpPlayer[] {
    // Shuffle the players array to avoid matching the same players together every time
    this.shuffle(this.players);

    // Create an array of matched players
    const matchedPlayers: grpPlayer[] = [];

    // Match players in pairs
    for (let i = 0; i < this.players.length; i += 2) {
      matchedPlayers.push({ client: this.players[i].client, options: this.players[i].options });
      matchedPlayers.push({ client: this.players[i + 1].client, options: this.players[i + 1].options });
    }

    // Clear the players array
    this.players = [];

    return matchedPlayers;
  }

  private shuffle(array: any[]) {
    // Shuffle an array in place
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  onLeave(client: Client) {
    // Remove the player from the players array
    this.players = this.players.filter(player => player.client !== client);
  }

  onDispose() {
    // Clean up any resources here...
  }
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad, X } from "lucide-react";

interface GameData {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  path: string;
}

const Games = () => {
  const [selectedGame, setSelectedGame] = useState<GameData | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const games: GameData[] = [
    {
      id: "qa",
      title: "Desafia Faro!",
      description: "Teste seus conhecimentos sobre a história de Faro com este quiz interativo!",
      imageUrl: "/Logo_Liga_Faro.png",
      path: "/jogo-qa/"
    },
    {
      id: "wordle",
      title: "Jogo de Palavras",
      description: "Adivinhe a palavra de 5 letras em 6 tentativas. Um desafio para testar seu vocabulário!",
      imageUrl: "/Logo_Liga_Faro.png",
      path: "/jogo-wordle/"
    },
    {
      id: "sopa",
      title: "Sopa de Letras do Algarve",
      description: "Encontre palavras relacionadas ao Algarve nesta divertida sopa de letras!",
      imageUrl: "/Logo_Liga_Faro.png",
      path: "/jogo_sopa/"
    }
  ];

  const openGame = (game: GameData) => {
    // Abrir o jogo em uma nova aba em vez de usar o iframe
    window.open(game.path, '_blank');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Jogos</h1>
        <p className="text-muted-foreground">Divirta-se com jogos interativos sobre Faro e teste seus conhecimentos.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => (
          <GameCard key={game.id} game={game} onPlay={() => openGame(game)} />
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-w-[95vw] sm:max-h-[90vh] max-h-[95vh] p-0 overflow-hidden">
          <DialogHeader className="p-3 sm:p-4 border-b">
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="font-display text-lg sm:text-xl">
                {selectedGame?.title}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 sm:h-9 sm:w-9">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          {selectedGame && (
            <div className="w-full h-[70vh] sm:h-[80vh]">
              <iframe
                src={selectedGame.path}
                className="w-full h-full border-0"
                title={selectedGame.title}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface GameCardProps {
  game: GameData;
  onPlay: () => void;
}

const GameCard = ({ game, onPlay }: GameCardProps) => {
  return (
    <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
      {game.imageUrl && (
        <div className="aspect-video w-full overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="h-16 w-auto object-contain"
          />
        </div>
      )}
      <div className="h-3 bg-gradient-to-r from-purple-500 to-blue-500" />
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="font-display">{game.title}</CardTitle>
          <Gamepad className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>{game.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={onPlay}
            className="gap-2"
            size="sm"
          >
            <Gamepad className="h-4 w-4" />
            Jogar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Games;
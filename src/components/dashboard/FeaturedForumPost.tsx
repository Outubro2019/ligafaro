
import { Link } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface FeaturedForumPostProps {
  post: {
    avatarUrl: string;
    author: string;
    title: string;
    content: string;
    comments: number;
    category: string;
  } | undefined;
}

const FeaturedForumPost = ({ post }: FeaturedForumPostProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Última Publicação do Fórum</CardTitle>
        <CardDescription>Junte-se à conversa</CardDescription>
      </CardHeader>
      <CardContent>
        {post ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.avatarUrl} />
                <AvatarFallback>{post.author.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{post.author}</span>
            </div>
            <h3 className="font-semibold text-lg">{post.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments} comentários</span>
              </div>
              <Badge variant="outline">{post.category}</Badge>
            </div>
          </div>
        ) : (
          <p>Ainda não há publicações no fórum. Seja o primeiro a publicar!</p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/forum">Ver Fórum</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedForumPost;

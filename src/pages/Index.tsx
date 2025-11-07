import { Wrench } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <div className="flex justify-center mb-8">
          <Wrench className="w-16 h-16 text-primary animate-pulse" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          agent13 ai
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground">
          Under Construction
        </p>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We're working on something amazing. Check back soon!
        </p>
      </div>
    </div>
  );
};

export default Index;

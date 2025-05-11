
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorStateProps {
  title: string;
  description: string;
  showButton?: boolean;
}

export function ErrorState({ title, description, showButton = true }: ErrorStateProps) {
  const navigate = useNavigate();
  
  return (
    <div>
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{description}</AlertDescription>
      </Alert>
      {showButton && (
        <Button onClick={() => navigate("/dashboard")} variant="outline">
          Go to Dashboard
        </Button>
      )}
    </div>
  );
}

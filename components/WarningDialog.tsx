import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface WarningDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const WarningDialog: React.FC<WarningDialogProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selection Limit Exceeded</DialogTitle>
        </DialogHeader>
        <p>You can only select up to 3 designs. Please deselect one before adding another.</p>
        <Button onClick={onClose} className="mt-4">OK</Button>
      </DialogContent>
    </Dialog>
  )
}

export default WarningDialog;

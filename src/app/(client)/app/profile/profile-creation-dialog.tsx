import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ProfileCreation } from './components/profile-creation'
import {ScrollArea} from "@/components/ui/scroll-area";
interface ProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
}
export default function ProfileCreationDialog({isOpen, onClose}: ProfileDialogProps) {
  return (
      <Dialog
          open={isOpen}
          onOpenChange={(open) => !open && onClose()}
      >
          <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
              <DialogHeader>
                  <DialogTitle>Complete Your Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 h-full w-full">
                  <ScrollArea className={'h-[600px] rounded-md'}>
                      <ProfileCreation />
                  </ScrollArea>
              </div>
          </DialogContent>
      </Dialog>
  );
}
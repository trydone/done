import { useContext, useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useClickOutside } from "@/hooks/useClickOutside";
import { taskStore, uiStore } from "@/stores";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { TimePicker } from "@/components/ui/time-picker";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Calendar as CalendarIcon, Clock } from "lucide-react";
import { RootStoreContext } from "@/lib/stores/root-store";

export const TaskDetails = observer(() => {
  const {
    localStore: { openTaskId, setOpenTaskId },
  } = useContext(RootStoreContext);

  const task = openTaskId ? taskStore.tasks.get(openTaskId) : null;
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.focus();
    }
  }, [openTaskId]);

  if (!task) return null;

  const handleClose = () => {
    setOpenTaskId(null);
  };

  const updateTask = (updates: Partial<Task>) => {
    taskStore.updateTask(task.id, updates);
  };

  const addChecklistItem = () => {
    const newChecklist = [
      ...task.checklist,
      { id: crypto.randomUUID(), text: "", completed: false },
    ];
    updateTask({ checklist: newChecklist });
  };

  const updateChecklistItem = (
    id: string,
    updates: Partial<(typeof task.checklist)[0]>,
  ) => {
    const newChecklist = task.checklist.map((item) =>
      item.id === id ? { ...item, ...updates } : item,
    );
    updateTask({ checklist: newChecklist });
  };

  const removeChecklistItem = (id: string) => {
    const newChecklist = task.checklist.filter((item) => item.id !== id);
    updateTask({ checklist: newChecklist });
  };

  const addTag = (tag: string) => {
    if (!task.tags.includes(tag)) {
      updateTask({ tags: [...task.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    updateTask({ tags: task.tags.filter((t) => t !== tag) });
  };

  return (
    <Dialog open={true} onOpenChange={() => handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={task.completed}
              onCheckedChange={(checked) =>
                updateTask({ completed: !!checked })
              }
            />
            <Input
              ref={titleRef}
              value={task.title}
              onChange={(e) => updateTask({ title: e.target.value })}
              className="text-lg font-medium border-none focus-visible:ring-0"
              placeholder="Task title"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="w-4 h-4 mr-1" /> Add Tag
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <Input
                  placeholder="Type tag and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addTag(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {task.deadline
                    ? format(task.deadline, "MMM d, yyyy")
                    : "Set deadline"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={task.deadline}
                  onSelect={(date) => updateTask({ deadline: date })}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Clock className="w-4 h-4 mr-2" />
                  {task.reminder
                    ? format(task.reminder, "h:mm a")
                    : "Set reminder"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <TimePicker
                  value={task.reminder}
                  onChange={(time) => updateTask({ reminder: time })}
                />
              </PopoverContent>
            </Popover>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <Textarea
            value={task.notes || ""}
            onChange={(e) => updateTask({ notes: e.target.value })}
            placeholder="Add notes..."
            className="min-h-[100px] resize-none"
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Checklist</h3>
              <Button variant="ghost" size="sm" onClick={addChecklistItem}>
                <Plus className="w-4 h-4 mr-1" /> Add Item
              </Button>
            </div>

            {task.checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <Checkbox
                  checked={item.completed}
                  onCheckedChange={(checked) =>
                    updateChecklistItem(item.id, { completed: !!checked })
                  }
                />
                <Input
                  value={item.text}
                  onChange={(e) =>
                    updateChecklistItem(item.id, { text: e.target.value })
                  }
                  className="flex-grow"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeChecklistItem(item.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

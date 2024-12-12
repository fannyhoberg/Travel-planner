import React, { useState } from "react";
import { Item, Trip } from "../types/trip";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useHandleTrip } from "../hooks/useHandleTrip";

type TripListProps = {
  id: string | undefined;
  trip: Trip | null;
  setAddingList: (value: string | null) => void;
  handleOpenPopup: (
    event: React.MouseEvent<HTMLElement>,
    itemId: string
  ) => void;
  isPopupOpen: boolean;
  selectedItem: null | string;
  anchorEl: null | HTMLElement;
  handleClosePopup: () => void;
  setInitialValues: React.Dispatch<React.SetStateAction<Partial<Item>>>;
  setListName: (value: string) => void;
  setUpdateItemDialog: (value: boolean) => void;
  setItemToUpdate: (value: string | null) => void;
};

const TripList = ({
  setAddingList,
  handleOpenPopup,
  isPopupOpen,
  selectedItem,
  anchorEl,
  handleClosePopup,
  setInitialValues,
  setListName,
  setUpdateItemDialog,
  setItemToUpdate,
  id,
  trip,
}: TripListProps) => {
  const { markItemAsCompleted, removeItemFromList, updateList } = useHandleTrip(
    id,
    trip
  );

  const [listToUpdate, setListToUpdate] = useState<string | null>(null);
  const [newListName, setNewListName] = useState<string>("");
  const [anchorListEl, setAnchorListEl] = useState<null | HTMLElement>(null);
  const [updateListDialog, setUpdateListDialogState] = useState(false);
  const [selectedList, setSelectedList] = useState<null | string>(null);

  const isListPopupOpen = Boolean(anchorListEl);

  const closeDialog = () => {
    setUpdateListDialogState(false);
  };

  const handleOpenPopupList = (
    event: React.MouseEvent<HTMLElement>,
    listId: string
  ) => {
    setAnchorListEl(event.currentTarget);
    setSelectedList(listId);
  };

  const handleClosePopupList = () => {
    setAnchorListEl(null);
    setSelectedList(null);
  };

  const handleEditList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateList(listToUpdate, newListName);
      setListToUpdate(null);
      setNewListName("");
      setUpdateListDialogState(false);
    } catch (err) {
      console.error("Error updating list:", err);
    }
  };

  const markPlaceAsDone = async (listName: string, itemId: string) => {
    await markItemAsCompleted(listName, itemId);
  };

  const handleRemoveItem = async (listName: string, itemId: string) => {
    await removeItemFromList(listName, itemId);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {trip?.lists?.map((list) => (
        <Box key={list._id} sx={{ paddingBottom: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "left",
              justifyContent: "space-between",
              padding: "8px",
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                backgroundColor: list.color,
                borderRadius: "50%",
                marginRight: "10px",
              }}
            />
            <Typography color="#2a3132" sx={{ textAlign: "left", flex: 1 }}>
              {list.name}
            </Typography>

            <IconButton
              onClick={() => setAddingList(list.name)}
              size="small"
              sx={{ color: "#2a3132" }}
              aria-label="Add new item to list"
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={(e) => handleOpenPopupList(e, list._id)}
              size="small"
              title="More actions"
              aria-label="More actions"
            >
              <MoreVertIcon />
            </IconButton>
            <Popover
              open={isListPopupOpen && selectedList === list._id}
              anchorEl={anchorListEl}
              onClose={handleClosePopupList}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
              <Box>
                <MenuItem
                  onClick={() => {
                    setListName(list.name);
                    setListToUpdate(list._id);
                    setNewListName(list.name);
                    setUpdateListDialogState(true);
                    handleClosePopupList();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem>Delete</MenuItem>
              </Box>
            </Popover>
          </Box>
          <Divider sx={{ marginTop: 1 }} />
          {list.items && list.items.length > 0 ? (
            <Box sx={{ padding: 3 }}>
              {list.items.map((item) => (
                <Box
                  key={item._id}
                  sx={{
                    marginBottom: 1,
                    padding: 2,
                    backgroundColor: item.completed ? "#DAD2C7" : "#F0EBE6",
                    borderRadius: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <Box sx={{ marginRight: 1 }}>
                    <IconButton
                      size="medium"
                      onClick={() => markPlaceAsDone(list.name, item._id)}
                      sx={{ color: "black" }}
                      title={item.completed ? "Mark as undone" : "Mark as done"}
                    >
                      {item.completed ? (
                        <TaskAltIcon />
                      ) : (
                        <RadioButtonUncheckedIcon />
                      )}
                    </IconButton>
                  </Box>
                  <Box sx={{ width: "100%", textAlign: "left" }}>
                    <Typography variant="body1" color={"textPrimary"}>
                      <strong>{item.title}</strong>
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {item.address}, {item.postcode}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={(e) => handleOpenPopup(e, item._id)}
                    size="small"
                    title="More actions"
                    aria-label="More actions"
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Popover
                    open={isPopupOpen && selectedItem === item._id}
                    anchorEl={anchorEl}
                    onClose={handleClosePopup}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <Box>
                      <MenuItem
                        onClick={() => {
                          setInitialValues({
                            title: item.title,
                            address: item.address,
                            city: item.city,
                          });
                          setListName(list.name);
                          setUpdateItemDialog(true);
                          setItemToUpdate(item._id);
                          handleClosePopup();
                        }}
                      >
                        Edit
                      </MenuItem>
                      <MenuItem
                        onClick={() => {
                          handleRemoveItem(list.name, item._id);
                          handleClosePopup();
                        }}
                      >
                        Delete
                      </MenuItem>
                    </Box>
                  </Popover>
                </Box>
              ))}
            </Box>
          ) : null}

          {updateListDialog && (
            <Dialog open={true} onClose={closeDialog}>
              <DialogTitle>Update listname</DialogTitle>
              <DialogContent>
                <Box sx={{ mt: 4 }} component="form" onSubmit={handleEditList}>
                  <TextField
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    variant="standard"
                    required
                  />
                  <Button variant="text" type="submit" sx={{ mt: 4 }}>
                    Save
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TripList;

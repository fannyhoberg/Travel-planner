import React, { useState } from "react";
import { Item, ListTextData, Trip } from "../types/trip";
import {
  Box,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { useHandleTrip } from "../hooks/useHandleTrip";
import ListFormDialog from "./ListFormDialog";
import ConfirmationModal from "./ConfirmationModal";
import LoadingSpinner from "./LoadingSpinner";

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
  const [showListDeleteModal, setShowListDeleteModal] = useState(false);
  const [showItemDeleteModal, setShowItemDeleteModal] = useState(false);
  const [listToUpdate, setListToUpdate] = useState<string | null>(null);
  const [newListName, setNewListName] = useState<string>("");
  const [anchorListEl, setAnchorListEl] = useState<null | HTMLElement>(null);
  const [updateListDialog, setUpdateListDialog] = useState(false);
  const [selectedList, setSelectedList] = useState<null | string>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const {
    isLoading,
    error,
    markItemAsCompleted,
    removeItemFromList,
    updateList,
    deleteList,
  } = useHandleTrip(id, trip);

  const isListPopupOpen = Boolean(anchorListEl);

  const closeDialog = () => {
    setUpdateListDialog(false);
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

  const handleEditList = async (data: ListTextData) => {
    console.log("data", data);

    await updateList(listToUpdate, data.name, data.color);
    setListToUpdate(null);
    setNewListName("");
    setUpdateListDialog(false);
  };

  const handleDeleteList = async () => {
    if (!selectedList) return;

    await deleteList(selectedList);
    setShowListDeleteModal(false);
    setSelectedList(null);
  };

  const markPlaceAsDone = async (listName: string, itemId: string) => {
    await markItemAsCompleted(listName, itemId);
  };

  const handleRemoveItem = async () => {
    if (!itemToDelete || !listToUpdate) return;

    await removeItemFromList(listToUpdate, itemToDelete);
    setShowItemDeleteModal(false);
    setItemToDelete(null);
  };

  return (
    <Box sx={{ width: "100%" }}>
      {isLoading && <LoadingSpinner />}

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

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
              title="Add new item to list"
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={(e) => {
                handleOpenPopupList(e, list._id), setSelectedColor(list.color);
              }}
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
                  tabIndex={1}
                  aria-label="Edit list"
                  title="Edit list"
                  onClick={() => {
                    setListToUpdate(list._id);
                    setNewListName(list.name);
                    setSelectedColor(list.color);
                    setUpdateListDialog(true);
                    handleClosePopupList();
                  }}
                >
                  Edit
                </MenuItem>
                <MenuItem
                  tabIndex={1}
                  aria-label="Delete list"
                  title="Delete list"
                  onClick={() => {
                    setSelectedList(list._id);
                    setShowListDeleteModal(true);
                  }}
                >
                  Delete
                </MenuItem>
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
                      {item.address
                        ? `${item.address}${
                            item.postcode ? `, ${item.postcode}` : ""
                          }`
                        : null}
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
                        tabIndex={1}
                        aria-label="Edit place"
                        title="Edit place"
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
                        tabIndex={1}
                        aria-label="Remove place from list"
                        title="Remove place from list"
                        onClick={() => {
                          setListToUpdate(list.name);
                          setItemToDelete(item._id);
                          setShowItemDeleteModal(true);
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
            <ListFormDialog
              onClose={closeDialog}
              handleEditList={handleEditList}
              setListName={setNewListName}
              setSelectedColor={setSelectedColor}
              selectedColor={selectedColor}
              initialValues={{ name: newListName, color: selectedColor }}
            />
          )}

          {showListDeleteModal && (
            <ConfirmationModal
              onOpen={showListDeleteModal}
              onConfirm={() => handleDeleteList()}
              onCancel={() => setShowListDeleteModal(false)}
            >
              Sure you want to delete this list?
            </ConfirmationModal>
          )}

          {showItemDeleteModal && (
            <ConfirmationModal
              onOpen={showItemDeleteModal}
              onConfirm={() => handleRemoveItem()}
              onCancel={() => {
                setShowItemDeleteModal(false), setItemToDelete(null);
              }}
            >
              Sure you want to remove this item?
            </ConfirmationModal>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default TripList;

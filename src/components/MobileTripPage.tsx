import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ItemFormDialog from "./ItemFormDialog";
import Map from "./Map";
import { Item, Trip } from "../types/trip";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import MoreVertIcon from "@mui/icons-material/MoreVert";

type MobileTripPageProps = {
  onAddNewList: () => void;
  addNewListDialog: boolean;
  data: Trip | null;
  handleSubmitNewList: (e: React.FormEvent) => void;
  addingList: string | null;
  onHandleSubmitItem: (item: any) => void;
  onCloseDialog: () => void;
  hasItemsInLists: boolean | undefined;
  setAddNewTripDialog: (value: boolean) => void;
  setListName: (value: string) => void;
  setAddingList: (value: string | null) => void;
  onMarkPlaceAsDone: (listName: string, itemId: string) => void;
  onRemoveItemFromList: (listName: string, itemId: string) => void;
  setUpdateItemDialog: (value: boolean) => void;
  updateItemDialog: boolean;
  setItemToUpdate: (value: string | null) => void;
  selectedColor: string;
  setSelectedColor: (value: string) => void;
};
const MobileTripPage = ({
  onAddNewList,
  addNewListDialog,
  data,
  handleSubmitNewList,
  addingList,
  onHandleSubmitItem,
  onCloseDialog,
  hasItemsInLists,
  setAddNewTripDialog,
  setListName,
  setAddingList,
  onMarkPlaceAsDone,
  onRemoveItemFromList,
  setUpdateItemDialog,
  updateItemDialog,
  setItemToUpdate,
  selectedColor,
  setSelectedColor,
}: MobileTripPageProps) => {
  const [initialValues, setInitialValues] = useState<Partial<Item>>({
    title: "",
    address: "",
    city: "",
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<null | string>(null);
  const handleOpenPopup = (
    event: React.MouseEvent<HTMLElement>,
    itemId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(itemId);
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const isPopupOpen = Boolean(anchorEl);

  const colors = [
    "#FFB2AA",
    "#FFA07A",
    "#FF6347",
    "#FFD700",
    "#ADFF2F",
    "#32CD32",
    "#1E90FF",
    "#9370DB",
    "#FF69B4",
    "#FF4500",
  ];

  return (
    <>
      <Box sx={{ mt: 4 }}>
        <Button
          onClick={onAddNewList}
          className="btn-primary"
          aria-label="Add list"
          title="Add list"
        >
          Add list
        </Button>
      </Box>

      {addNewListDialog && data && (
        <ClickAwayListener onClickAway={() => setAddNewTripDialog(false)}>
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mt: 3,
                mb: 5,
              }}
              component="form"
              onSubmit={handleSubmitNewList}
            >
              <TextField
                label="Name your list"
                name="new-list"
                type="text"
                variant="standard"
                // value={listName}
                onChange={(e) => setListName(e.target.value)}
                required
                sx={{ flex: 1 }}
              />
              <Button
                sx={{ marginLeft: 0, color: "black" }}
                variant="text"
                type="submit"
                title="Ok"
                aria-label="Enter OK"
              >
                OK
              </Button>
            </Box>
            <Box sx={{ mb: 4 }}>
              {/* <Typography sx={{ alignItems: "left" }}>
                    Select a Color
                  </Typography> */}
              <Box style={{ display: "flex", gap: "10px" }}>
                {colors.map((color) => (
                  <Box
                    key={color}
                    style={{
                      width: "30px",
                      height: "30px",
                      backgroundColor: color,
                      borderRadius: "50%",
                      border:
                        selectedColor === color ? "2px solid black" : "none",
                      cursor: "pointer",
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
        </ClickAwayListener>
      )}
      {data &&
        data.lists?.map((list) => {
          return (
            <Box key={list._id}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "left",
                  justifyContent: "space-between",
                  padding: "8px",
                }}
              >
                <div
                  key={list.color}
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
                  // onClick={(e) => handleOpenPopup(e, item._id)}
                  size="small"
                  aria-label="More actions"
                  title="More actions"
                >
                  <MoreVertIcon />
                </IconButton>
                <Popover
                  open={isPopupOpen}
                  anchorEl={anchorEl}
                  onClose={handleClosePopup}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Box>
                    <MenuItem
                    // onClick={() => {
                    //   setInitialValues({
                    //     title: item.title,
                    //     address: item.address,
                    //     city: item.city,
                    //   });
                    //   setListName(list.name);
                    //   setUpdateItemDialog(true);
                    //   setItemToUpdate(item._id);
                    //   handleClosePopup();
                    // }}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                    // onClick={() => {
                    //   onRemoveItemFromList(list.name, item._id);
                    //   handleClosePopup();
                    // }}
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
                        justifyContent: "flex-end",
                      }}
                    >
                      <Box sx={{ marginRight: 1 }}>
                        <IconButton
                          size="medium"
                          onClick={() => onMarkPlaceAsDone(list.name, item._id)}
                          sx={{
                            color: "black",
                          }}
                          title={
                            item.completed ? "Mark as undone" : "Mark as done"
                          }
                          aria-label="Mark as done"
                        >
                          {item.completed ? (
                            <TaskAltIcon />
                          ) : (
                            <RadioButtonUncheckedIcon />
                          )}
                        </IconButton>
                      </Box>

                      <Box
                        sx={{
                          width: "100%",
                          textAlign: "left",
                        }}
                      >
                        <Typography variant="body1" color="textPrimary">
                          <strong>{item.title}</strong>
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {item.address}, {item.postcode}
                        </Typography>
                      </Box>

                      <IconButton
                        onClick={(e) => handleOpenPopup(e, item._id)}
                        size="medium"
                        title="More actions"
                        aria-label="More actions"
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Popover
                        open={isPopupOpen && selectedItem === item._id}
                        anchorEl={anchorEl}
                        onClose={handleClosePopup}
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
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
                              onRemoveItemFromList(list.name, item._id);
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
            </Box>
          );
        })}
      {addingList && (
        <ItemFormDialog
          onSubmit={onHandleSubmitItem}
          onClose={onCloseDialog}
          listName={addingList}
        />
      )}
      {updateItemDialog && (
        <ItemFormDialog
          onSubmit={onHandleSubmitItem}
          onClose={onCloseDialog}
          listName={addingList}
          initialValues={initialValues}
        />
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Typography>Notes</Typography>
      </Box>
      <TextField
        fullWidth
        id="outlined-multiline-static"
        label=""
        multiline
        rows={4}
      />

      {hasItemsInLists && <Map />}
    </>
  );
};

export default MobileTripPage;

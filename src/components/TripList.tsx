import React from "react";
import { Item, List, Trip } from "../types/trip";

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

type TripListProps = {
  id: string | undefined;
  trip: Trip;
  lists: List[] | undefined;
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
  lists,
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
  trip,
  id,
}: TripListProps) => {
  return lists?.map((list) => {
    const { markItemAsCompleted, removeItemFromList, addNewItem, updateItem } =
      useHandleTrip(id, trip);

    const markPlaceAsDone = async (listName: string, itemId: string) => {
      await markItemAsCompleted(listName, itemId);
    };

    const handleRemoveItem = async (listName: string, itemId: string) => {
      await removeItemFromList(listName, itemId);
    };
    return (
      <Box
        sx={{
          width: "100%",
        }}
        key={list._id}
      >
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
                    sx={{
                      color: "black",
                    }}
                    title={item.completed ? "Mark as undone" : "Mark as done"}
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
      </Box>
    );
  });
};

export default TripList;

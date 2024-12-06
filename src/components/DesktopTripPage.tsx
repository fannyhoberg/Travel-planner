import {
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import ItemFormDialog from "./ItemFormDialog";
import Map from "./Map";
import { Item, Trip } from "../types/trip";

type DesktopTripPageProps = {
  onAddNewList: () => void;
  addNewListDialog: boolean;
  data: Trip | null;
  handleSubmitNewList: (e: React.FormEvent) => void;
  listName: string;
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

const DesktopTripPage = ({
  hasItemsInLists,
  onAddNewList,
  listName,
  addNewListDialog,
  data,
  addingList,
  handleSubmitNewList,
  onHandleSubmitItem,
  onCloseDialog,
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
}: DesktopTripPageProps) => {
  const [initialValues, setInitialValues] = useState<Partial<Item>>({
    title: "",
    address: "",
    city: "",
  });

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
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 4,
          mt: 4,
        }}
      >
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {hasItemsInLists && <Map />}

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
        </Box>
        <Box
          sx={{
            flex: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
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
              <>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                  }}
                  component="form"
                  onSubmit={handleSubmitNewList}
                >
                  <TextField
                    label="Name your list"
                    name="new-list"
                    type="text"
                    variant="standard"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    required
                    sx={{ flex: 1 }}
                  />
                  <Button
                    sx={{ marginLeft: 0, color: "black" }}
                    variant="text"
                    type="submit"
                    aria-label="Enter OK"
                    title="OK add to list"
                  >
                    OK
                  </Button>
                </Box>
                <Box sx={{ mb: 4 }}>
                  <Typography sx={{ alignItems: "left" }}>
                    Select a Color
                  </Typography>
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
                            selectedColor === color
                              ? "2px solid black"
                              : "none",
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedColor(color)}
                      />
                    ))}
                  </Box>
                </Box>
              </>
            </ClickAwayListener>
          )}
          {data &&
            data.lists?.map((list) => {
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
                        cursor: "pointer",
                      }}
                    />

                    <Box
                      sx={{
                        marginRight: 1,
                      }}
                    >
                      <Button
                        variant="text"
                        sx={{
                          color: "black",
                          padding: 0,
                        }}
                        title="Remove list"
                        aria-label="Remove list"
                      >
                        <ClearIcon />
                      </Button>
                    </Box>

                    <Typography
                      color="#2a3132"
                      sx={{ textAlign: "left", flex: 1 }}
                    >
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
                            backgroundColor: item.completed
                              ? "#CB6258"
                              : "#FFB2AA",
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box
                            sx={{
                              marginRight: 1,
                            }}
                          >
                            <Button
                              variant="text"
                              onClick={() =>
                                onRemoveItemFromList(list.name, item._id)
                              }
                              sx={{
                                color: "black",
                                padding: 0,
                              }}
                              title="Remove from list"
                              aria-label="Remove from list"
                            >
                              <ClearIcon sx={{ fontSize: "20px" }} />
                            </Button>
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
                          <Box
                            sx={{
                              marginRight: 1,
                            }}
                          >
                            <Button
                              variant="text"
                              onClick={() =>
                                onMarkPlaceAsDone(list.name, item._id)
                              }
                              sx={{
                                color: "black",
                                padding: 0,
                              }}
                              title={
                                item.completed
                                  ? "Mark as undone"
                                  : "Mark as done"
                              }
                              aria-label="Mark as done"
                            >
                              <CheckCircleOutlineOutlinedIcon
                                sx={{ fontSize: "20px" }}
                              />
                            </Button>
                            <Box>
                              <Button
                                variant="text"
                                onClick={() => {
                                  setInitialValues({
                                    title: item.title,
                                    address: item.address,
                                    city: item.city,
                                  });
                                  setListName(list.name);
                                  setUpdateItemDialog(true);
                                  setItemToUpdate(item._id);
                                }}
                                sx={{
                                  color: "black",
                                  padding: 0,
                                }}
                                aria-label="Update info"
                              >
                                Edit
                              </Button>
                            </Box>
                          </Box>
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
        </Box>
      </Box>
    </>
  );
};

export default DesktopTripPage;

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
import ItemFormDialog from "./ItemFormDialog";
import Map from "./Map";
import { Item, Trip } from "../types/trip";
import AddIcon from "@mui/icons-material/Add";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ClearIcon from "@mui/icons-material/Clear";

type MobileTripPageProps = {
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
};
const MobileTripPage = ({
  onAddNewList,
  addNewListDialog,
  data,
  handleSubmitNewList,
  listName,
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
}: MobileTripPageProps) => {
  const [initialValues, setInitialValues] = useState<Partial<Item>>({
    title: "",
    address: "",
    city: "",
  });

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
              value={listName}
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
                        backgroundColor: item.completed ? "#CB6258" : "#FFB2AA",
                        borderRadius: 3,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
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
                      <Box>
                        <Button
                          variant="text"
                          onClick={() => onMarkPlaceAsDone(list.name, item._id)}
                          sx={{
                            color: "black",
                            padding: 0,
                          }}
                          title={
                            item.completed ? "Mark as undone" : "Mark as done"
                          }
                          aria-label="Mark as done"
                        >
                          <CheckCircleOutlineOutlinedIcon
                            sx={{ fontSize: "20px" }}
                          />
                        </Button>
                      </Box>
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

import { useParams } from "react-router-dom";
import useGetTrip from "../hooks/useGetTrip";
import {
  Container,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  IconButton,
  Popover,
  MenuItem,
  Divider,
  Tooltip,
} from "@mui/material";

import { useState } from "react";
import { GeoPoint } from "firebase/firestore";
import { getGeopoint } from "../services/geocodingAPI";
import { v4 as uuidv4 } from "uuid";
import { useHandleTrip } from "../hooks/useHandleTrip";
import ItemFormDialog from "../components/ItemFormDialog";
import ListFormDialog from "../components/ListFormDialog";
import Map from "../components/Map";
import { Item, ListTextData } from "../types/trip";
import BackButton from "../components/BackButton";
import useAuth from "../hooks/useAuth";
import AccessDenied from "../components/AccessDenied";
import LoadingSpinner from "../components/LoadingSpinner";
import AddIcon from "@mui/icons-material/Add";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ConfirmationModal from "../components/ConfirmationModal";
import Notes from "../components/Notes";
import PDFGenerator from "../components/ExportTrip";
import MoveItemDialog from "../components/MoveItemDialog";
import InviteFriendFormDialog from "../components/InviteFriendFormDialog";
import ProfileCircle from "../components/ProfileCircle";

const TripPage = () => {
  const [addNewListDialog, setAddNewTripDialog] = useState(false);
  const [listName, setListName] = useState<string>("");
  const [addingList, setAddingList] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedList, setSelectedList] = useState<null | string>(null);
  const [newListName, setNewListName] = useState<string>("");
  const [updateListDialog, setUpdateListDialog] = useState(false);
  const [listToUpdate, setListToUpdate] = useState<string | null>(null);
  const [inviteFriendDialog, setInviteFriendDialog] = useState<boolean>(false);

  const [updateItemDialog, setUpdateItemDialog] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState<Partial<Item>>({
    title: "",
    address: "",
    city: "",
  });
  const [selectedItem, setSelectedItem] = useState<null | string>(null);
  const [moveItemDialogOpen, setMoveItemDialogOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [listAnchorEl, setListAnchorEl] = useState<null | HTMLElement>(null);
  const [itemAnchorEl, setItemAnchorEl] = useState<null | HTMLElement>(null);

  const [showListDeleteModal, setShowListDeleteModal] = useState(false);
  const [showItemDeleteModal, setShowItemDeleteModal] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const { id } = useParams();

  const { currentUser } = useAuth();
  const {
    data: trip,
    isError: getTripError,
    isLoading: getTripLoading,
  } = useGetTrip(id);

  const {
    error: handleTripError,
    isLoading: handleTripLoading,
    addNewList,
    addNewItem,
    updateItem,
    markItemAsCompleted,
    removeItemFromList,
    updateList,
    deleteList,
    inviteFriend,
  } = useHandleTrip(id, trip);

  const handleOpenListPopup = (
    event: React.MouseEvent<HTMLElement>,
    listId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setListAnchorEl(event.currentTarget);
    setSelectedList(listId);
  };

  const handleOpenItemPopup = (
    event: React.MouseEvent<HTMLElement>,
    itemId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setItemAnchorEl(event.currentTarget);
    setSelectedItem(itemId);
    setItemToUpdate(itemId);
  };

  const handleClosePopup = () => {
    setListAnchorEl(null);
    setItemAnchorEl(null);
    setSelectedItem(null);
    setSelectedList(null);
  };

  const isListPopupOpen = Boolean(listAnchorEl);
  const isItemPopupOpen = Boolean(itemAnchorEl);

  const closeDialog = () => {
    setAddNewTripDialog(false);
    setAddingList(null);
    setUpdateItemDialog(false);
    setUpdateListDialog(false);
    setInviteFriendDialog(false);
    setNewListName("");
    setSelectedColor("");
  };

  const hasItemWithAddress = trip?.lists?.some((list) =>
    list.items?.some((item) => item.address?.trim() !== "")
  );
  const hasItemsInLists = trip?.lists?.some(
    (list) => list.items && list.items.length > 0
  );
  const showMap = hasItemsInLists && hasItemWithAddress;

  const hasMultipleLists = (trip?.lists?.length || 0) > 1;

  const handleSubmitNewList = async (data: ListTextData) => {
    await addNewList(data.name, data.color);
    setListName("");
    setAddingList(null);
    setAddNewTripDialog(false);
  };

  const handleSubmitItem = async (item: { title: string; address: string }) => {
    if (!trip) return;

    let newItemObj: any = {
      title: item.title,
      address: item.address,
    };

    if (item.address) {
      const payload = await getGeopoint(item.address);

      if (!payload) {
        console.error("Geopoint retrieval failed");
        return;
      }

      newItemObj = {
        ...newItemObj,
        geopoint: new GeoPoint(payload.coords.lat, payload.coords.lng),
        place_id: payload.place_id,
      };
    }

    if (updateItemDialog) {
      const updatedItemObj = {
        ...newItemObj,
      };

      await updateItem(listName, itemToUpdate!, updatedItemObj);

      setUpdateItemDialog(false);
      setItemToUpdate(null);
      setAddingList(null);
    } else {
      const newItemWithId = {
        _id: uuidv4(),
        ...newItemObj,
        completed: false,
      };
      await addNewItem(addingList, newItemWithId);
      setAddingList(null);
    }
  };

  const handleEditList = async (data: ListTextData) => {
    if (!listToUpdate) return;

    await updateList(listToUpdate, data.name, data.color);
    setSelectedList(null);
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
    if (!itemToUpdate || !listToUpdate) return;

    await removeItemFromList(listToUpdate, itemToUpdate);
    setShowItemDeleteModal(false);
    setItemToUpdate(null);
  };

  const handleMoveItem = async (targetListName: string) => {
    if (!itemToUpdate || !trip) return;

    const originalList = trip?.lists?.find((list) =>
      list?.items?.some((item) => item._id === itemToUpdate)
    );
    if (!originalList) return;

    const item = originalList?.items?.find((item) => item._id === itemToUpdate);
    if (!item) return;

    originalList.items = originalList?.items?.filter(
      (item) => item._id !== itemToUpdate
    );

    await removeItemFromList(originalList.name, itemToUpdate);
    const newItem = { ...item, _id: uuidv4() };
    await addNewItem(targetListName, newItem);

    setMoveItemDialogOpen(false);
    setItemToUpdate(null);
  };

  const handleInviteFriend = async (
    userId: string | undefined,
    userEmail: string | undefined
  ) => {
    setInviteFriendDialog(true);

    try {
      await inviteFriend(userId, userEmail);
      console.log("User successfully invited!");
    } catch (err) {
      console.error("Error inviting user:", err);
    }
    setInviteFriendDialog(false);
  };

  if (
    currentUser?.uid !== trip?.userId &&
    !getTripLoading &&
    !trip?.allowedUsers?.some((user) => user.id === currentUser?.uid)
  ) {
    return <AccessDenied />;
  }

  return (
    <>
      {getTripLoading && <LoadingSpinner />}
      {getTripError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {getTripError}
        </Typography>
      )}
      {handleTripLoading && <LoadingSpinner />}
      {handleTripError && (
        <Typography color="error" sx={{ mt: 2 }}>
          {handleTripError}
        </Typography>
      )}
      <Container
        sx={isMobile ? { mb: "10vh", mt: 6 } : { mb: "10vh" }}
        maxWidth={isMobile ? "sm" : "lg"}
      >
        <BackButton />
        <Typography sx={{ pt: 5, pb: 3 }} variant="h1">
          {trip?.title}
        </Typography>

        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="body2">Owner:</Typography>
            <ProfileCircle name={trip?.owner} />
          </Box>

          {trip?.allowedUsers?.length != null && (
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Typography variant="body2">Shared with:</Typography>
              {trip.allowedUsers.map((user, index) => (
                <ProfileCircle name={user.email} index={index} />
              ))}
            </Box>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
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
            {showMap && !isMobile && <Map />}
            {!isMobile && <Notes id={id} trip={trip} />}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: { xs: "center", md: "flex-start" },
                gap: 2,
              }}
            >
              <PDFGenerator trip={trip} />

              <Tooltip title="Feature coming soon" arrow>
                <span>
                  <Button
                    sx={{ ml: { md: 2, xs: 0 } }}
                    onClick={() => setInviteFriendDialog(true)}
                    className="btn-secondary"
                    aria-label="Invite friend button"
                  >
                    Invite friend
                  </Button>
                </span>
              </Tooltip>
            </Box>
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
                justifyContent: isMobile ? "center" : "flex-end",
              }}
            >
              <Button
                onClick={() => {
                  setAddNewTripDialog(true);
                }}
                className="btn-primary"
                aria-label="Add list"
                title="Add list"
                sx={{ mb: 2 }}
              >
                Add list
              </Button>
            </Box>
            {(!trip?.lists || trip.lists.length === 0) && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  mt: 2,
                  width: "100%",
                }}
              >
                <Typography variant="body1">
                  Add list to fill with places to visit! <br />
                  For example: <i>Restaurants</i>, <i>Museums</i>, or{" "}
                  <i>Parks</i>.
                </Typography>
              </Box>
            )}
            {addNewListDialog && trip && (
              <ListFormDialog
                onClose={closeDialog}
                handleSubmitNewList={handleSubmitNewList}
                setListName={setListName}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
              />
            )}
            <Box sx={{ width: "100%" }}>
              {handleTripLoading && <LoadingSpinner />}
              {handleTripError && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {handleTripError}
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
                    <Typography
                      variant="h3"
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
                    <IconButton
                      onClick={(e) => {
                        handleOpenListPopup(e, list._id),
                          setSelectedColor(list.color);
                      }}
                      size="small"
                      title="More actions"
                      aria-label="More actions"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      open={isListPopupOpen && selectedList === list._id}
                      anchorEl={anchorEl}
                      onClose={handleClosePopup}
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
                            handleClosePopup();
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
                            backgroundColor: item.completed
                              ? "#DAD2C7"
                              : "#FFFFFF",
                            border: "0.1px solid lightgrey",
                            borderRadius: 3,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Box sx={{ marginRight: 1 }}>
                            <IconButton
                              size="medium"
                              onClick={() =>
                                markPlaceAsDone(list.name, item._id)
                              }
                              sx={{ color: "black" }}
                              aria-label="Check box to mark as done"
                              title={
                                item.completed
                                  ? "Mark as undone"
                                  : "Mark as done"
                              }
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
                            onClick={(e) => handleOpenItemPopup(e, item._id)}
                            size="small"
                            title="More actions"
                            aria-label="More actions"
                          >
                            <MoreVertIcon />
                          </IconButton>
                          <Popover
                            open={isItemPopupOpen && selectedItem === item._id}
                            anchorEl={anchorEl}
                            onClose={handleClosePopup}
                            anchorOrigin={{
                              vertical: "bottom",
                              horizontal: "left",
                            }}
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
                              {hasMultipleLists && (
                                <MenuItem
                                  tabIndex={1}
                                  onClick={() => {
                                    setListName(list.name);
                                    setItemToUpdate(item._id);
                                    setMoveItemDialogOpen(true);
                                    handleClosePopup();
                                  }}
                                  title="Move item"
                                  aria-label="Move item"
                                >
                                  Move
                                </MenuItem>
                              )}
                              <MenuItem
                                tabIndex={1}
                                aria-label="Remove place from list"
                                title="Remove place from list"
                                onClick={() => {
                                  setListToUpdate(list.name);
                                  setItemToUpdate(item._id);
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
                </Box>
              ))}
            </Box>
            {addingList && (
              <ItemFormDialog
                onSubmit={handleSubmitItem}
                onClose={closeDialog}
                listName={addingList}
              />
            )}
            {updateListDialog && (
              <ListFormDialog
                onClose={closeDialog}
                handleEditList={handleEditList}
                setListName={setNewListName}
                setSelectedColor={setSelectedColor}
                selectedColor={selectedColor}
                initialValues={{
                  name: newListName,
                  color: selectedColor,
                }}
              />
            )}
            {updateItemDialog && (
              <ItemFormDialog
                onSubmit={handleSubmitItem}
                onClose={closeDialog}
                listName={addingList}
                initialValues={initialValues}
              />
            )}
            {moveItemDialogOpen && (
              <MoveItemDialog
                moveItemDialogOpen={moveItemDialogOpen}
                setMoveItemDialogOpen={setMoveItemDialogOpen}
                trip={trip}
                handleMoveItem={handleMoveItem}
                currentListName={listName}
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
                  setShowItemDeleteModal(false), setItemToUpdate(null);
                }}
              >
                Sure you want to remove this item?
              </ConfirmationModal>
            )}
            {inviteFriendDialog && (
              <InviteFriendFormDialog
                onClose={closeDialog}
                handleInviteFriend={handleInviteFriend}
              />
            )}
          </Box>
        </Box>
        {isMobile && <Notes id={id} trip={trip} />}
        {showMap && isMobile && <Map />}
      </Container>
    </>
  );
};

export default TripPage;

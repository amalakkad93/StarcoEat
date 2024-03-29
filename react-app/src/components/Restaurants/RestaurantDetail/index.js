/**
 * RestaurantDetail Component
 *
 * This component displays detailed information about a specific restaurant.
 * It includes restaurant details, menu items, reviews, and allows users to mark
 * the restaurant as a favorite.
 */
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as solidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as regularHeart } from "@fortawesome/free-regular-svg-icons";
import MoreInfoModal from "./MoreInfoModal";
import OpenModalButton from "../../Modals/OpenModalButton";
import MenuSection from "../../MenuItems/GetMenuItems";
import MenuFilter from "../../MenuItems/MenuFilter";
import CreateMenuItemForm from "../../MenuItems/MenuItemForm/CreateMenuItemForm";
import GetReviews from "../../Reviews/GetReviews";
import CreateReview from "../../Reviews/CreateReview";
import { thunkGetRestaurantDetails } from "../../../store/restaurants";
import {
  thunkGetMenuItemsByRestaurantId,
  thunkGetFilteredMenuItems,
  clearFilteredMenuItems,
} from "../../../store/menuItems";
import {
  thunkToggleFavorite,
  thunkFetchAllFavorites,
} from "../../../store/favorites";
import "./RestaurantDetail.css";

export default function RestaurantDetail() {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const isMountedRef = useRef(true);

  // **************************************************************************************
  // Use Selectors
  // **************************************************************************************
  // Redux state selectors
  const currentUser = useSelector((state) => state.session?.user, shallowEqual);
  const restaurantData = useSelector(
    (state) => state.restaurants?.singleRestaurant,
    shallowEqual
  );
  const menuItemsByRestaurant = useSelector(
    (state) => state.menuItems?.menuItemsByRestaurant?.[restaurantId] || {},
    shallowEqual
  );
  const menuItemsForRestaurant = useSelector(
    (state) => state.menuItems?.menuItemsByRestaurant?.[restaurantId] ?? [],
    shallowEqual
  );

  // const menuItemsForRestaurant = menuItemsByRestaurant?.[restaurantId] ?? [];
  const menuItemImages = useSelector(
    (state) => state.menuItems?.menuItemImages || {},
    shallowEqual
  );
  const noMenuItems =
    !menuItemsForRestaurant.allIds ||
    menuItemsForRestaurant.allIds.length === 0;

  const reviewImages = useSelector(
    (state) => state.reviews?.reviewImages || {},
    shallowEqual
  );
  const userId = useSelector((state) => state.session.user?.id, shallowEqual);
  const favoritesById = useSelector(
    (state) => state.favorites?.byId,
    shallowEqual
  );
  const menuItemsTypes = useSelector(
    (state) => state.menuItems?.types || {},
    shallowEqual
  );

  const reviews = useSelector(
    (state) => state.reviews?.reviews || {},
    shallowEqual
  );
  const noReviews = !reviews || Object.keys(reviews).length === 0;
  const userHasReview = useSelector((state) => state.reviews.userHasReview);
  const filteredMenuItems = useSelector(
    (state) => state.menuItems?.filteredMenuItems
  );

  // **************************************************************************************
  // Use State
  // **************************************************************************************

  // Local state definitions
  const [loading, setLoading] = useState(true);
  const [reloadPage, setReloadPage] = useState(false);
  const [isFavorite, setIsFavorite] = useState(!!favoritesById[restaurantId]);

  const restaurant = restaurantData?.byId?.[restaurantId] || null;
  const owner = restaurant?.owner_id || {};

  const groupItemsByType = (items) => {
    const grouped = {};
    items.forEach((item) => {
      if (!grouped[item.type]) {
        grouped[item.type] = [];
      }
      grouped[item.type].push(item);
    });
    return grouped;
  };

  const isFilterApplied =
    filteredMenuItems && Object.keys(filteredMenuItems).length > 0;

  // Group items by type when filtered
  const groupedFilteredItems = isFilterApplied
    ? groupItemsByType(Object.values(filteredMenuItems))
    : {};

  // **************************************************************************************
  // Use Effect
  // **************************************************************************************

  // Fetch restaurant details and menu items
  // Clearing the filter for the new restaurant
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      dispatch(clearFilteredMenuItems());
      await dispatch(thunkGetRestaurantDetails(restaurantId));
      await dispatch(thunkGetMenuItemsByRestaurantId(restaurantId));
      if (isMountedRef.current) {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, restaurantId, reloadPage]);

  // Fetch user's favorite restaurants
  useEffect(() => {
    if (userId && isMountedRef.current) {
      dispatch(thunkFetchAllFavorites(userId));
    }
  }, [dispatch, userId]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // **************************************************************************************
  // Event Handlers
  // **************************************************************************************

  // Handle favorite click
  const handleFavoriteClick = async (e, restaurantId) => {
    e.stopPropagation();
    if (userId) {
      dispatch(thunkToggleFavorite(userId, restaurantId));
      setIsFavorite(!isFavorite);
    }
  };

  const handleFilterChange = (filters) => {
    const { types, minPrice, maxPrice } = filters;
    if (types.length === 0 && !minPrice && !maxPrice) {
      // Reset filter: fetch all menu items
      dispatch(thunkGetMenuItemsByRestaurantId(restaurantId));
    } else {
      // Apply filters
      dispatch(
        thunkGetFilteredMenuItems(restaurantId, types, minPrice, maxPrice)
      );
    }
  };

  const handleFilterReset = () => {
    dispatch(clearFilteredMenuItems());
  };
  // **************************************************************************************
  // Render
  // **************************************************************************************
  if (!restaurant) return null;
  if (menuItemsByRestaurant === undefined) return null;
  if(!menuItemsTypes) return null;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="restaurant-detail-container">
      <div className="restaurant-detail-header">
        <div
          className="restaurant-banner"
          style={{
            backgroundImage: `url(${restaurant?.banner_image_path})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
          }}
        >
          <FontAwesomeIcon
            icon={isFavorite ? solidHeart : regularHeart}
            className="favorite-heart"
            onClick={(e) => handleFavoriteClick(e, restaurantId)}
          />
        </div>

        <h1 className="restaurant-name">{restaurant?.name}</h1>

        <div className="avgRating-numberOfReviews-container">
          <span className="avgRating-numberOfReviews-span">
            ★{" "}
            {restaurant?.average_rating ? (
              restaurant?.average_rating
            ) : (
              <span className="boldText">New</span>
            )}
          </span>

          {restaurant && restaurant?.num_reviews > 0 && (
            <div className="num_reviews-food_type-moreInfo-div">
              {`(${restaurant?.num_reviews}${
                restaurant?.num_reviews === 1 ? " review" : " reviews"
              }) • ${restaurant?.food_type} ɵ`}
              <OpenModalButton
                modalComponent={<MoreInfoModal restaurant={restaurant} />}
                buttonText="More info"
              />
            </div>
          )}
        </div>
        {currentUser && restaurant?.owner_id === currentUser?.id && (
          <OpenModalButton
            className="add-menu-item-btn"
            buttonText="Add Menu Item"
            modalComponent={
              <CreateMenuItemForm
                restaurantId={restaurantId}
                setReloadPage={setReloadPage}
              />
            }
          />
        )}
      </div>

      <div className="restaurant-detail-body">
        {!noMenuItems && (
          <div className="restaurant-detail-sidebar">
            <MenuFilter
              onFilterChange={handleFilterChange}
              onFilterReset={handleFilterReset}
              menuTypes={menuItemsTypes}
            />
          </div>
        )}

        <div className="restaurant-detail-main-content">

          <div className="menu-items-container">
            {isFilterApplied
              ? Object.entries(groupedFilteredItems).map(([type, items]) => (
                  <MenuSection
                    key={type}
                    type={type}
                    items={items}
                    menuItemImages={menuItemImages}
                    setReloadPage={setReloadPage}
                    restaurantId={restaurantId}
                  />
                ))
              : Object.entries(menuItemsTypes ?? {}).map(([type, itemIds]) => {
                  const itemsOfType = itemIds
                    .map((id) => menuItemsByRestaurant?.byId?.[id])
                    .filter(Boolean);
                  return (
                    <MenuSection
                      key={type}
                      type={type}
                      items={itemsOfType}
                      menuItemImages={menuItemImages}
                      setReloadPage={setReloadPage}
                      restaurantId={restaurantId}
                    />
                  );
                })}
          </div>

          {/* Reviews */}
          <div className="reviews-section">
            <h2 className="avgRating-numofReviews">
              ★{" "}
              {restaurant?.average_rating !== undefined ? (
                Number(restaurant?.average_rating).toFixed(1)
              ) : (
                <span className="boldText">New</span>
              )}
              {restaurant?.num_reviews === 0 &&
                !userHasReview &&
                currentUser?.id !== restaurant?.owner_id &&
                ` · No reviews, be the first!`}
              {restaurant?.num_reviews === 1 && ` · 1 review`}
              {restaurant?.num_reviews > 1 &&
                ` · ${restaurant?.num_reviews} reviews`}
            </h2>

            {!userHasReview &&
              currentUser &&
              currentUser?.id !== restaurant?.owner_id && (
                <OpenModalButton
                  className="post-delete-review-btn"
                  buttonText="Post Your Review"
                  modalComponent={
                    <CreateReview
                      restaurantId={restaurantId}
                      setReloadPage={setReloadPage}
                    />
                  }
                />
              )}

            {/* {(!userHasReview || currentUser.id === restaurant.owner_id) && ( */}
            <GetReviews
              restaurantId={restaurantId}
              reviewImages={reviewImages}
              setReloadPage={setReloadPage}
            />
            {/* )} */}
          </div>
        </div>

      </div>
    </div>
  );
}

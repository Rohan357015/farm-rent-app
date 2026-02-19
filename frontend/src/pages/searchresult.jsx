import React from "react";
import myphoto from "../assets/default-avtar.png";
export const SearchResult = ({ data, searchType }) => {

    return (
        <div className="max-h-[400px] overflow-y-auto">

            {/* PRODUCTS */}
            {searchType === "products" && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                        Product Results
                    </h2>

                    {data.products?.length === 0 && (
                        <p className="text-gray-500 text-sm">No products found</p>
                    )}

                    {data.products?.map((product) => (
                        <div
                            key={product._id}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                            <img
                                src={product.images}
                                alt={product.equipmentName}
                                className="w-14 h-14 rounded-lg object-cover border"
                            />

                            <div>
                                <h3 className="font-semibold text-gray-800">
                                    {product.equipmentName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {product.brand}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* USERS */}
            {searchType === "users" && (
                <div>
                    <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">
                        User Results
                    </h2>
                    
                    {data.users?.length === 0 && (
                        <p className="text-gray-500 text-sm">No users found</p>
                    )}

                    {data.users?.map((user) => (
                        <div
                            key={user._id}
                            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition cursor-pointer"
                        >
                            <img
                                src={user.image || myphoto}
                                alt={user.name}
                                className="w-14 h-14 rounded-full object-cover border"
                            />

                            <div className="flex flex-col">
                                <h3 className="font-semibold text-gray-800">
                                    {user.name}
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {user.email}
                                </p>
                                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full w-fit mt-1">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

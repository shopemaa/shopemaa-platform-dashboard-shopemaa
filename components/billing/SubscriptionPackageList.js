import SubscriptionPackageItem from "./SubscriptionPackageItem";

const SubscriptionPackageList = ({subscriptions, showCheckoutCallback, activeSubscriptionId}) => {
    return (
        <>
            {subscriptions && subscriptions.length > 0 &&
                subscriptions
                    .slice()
                    .sort((a, b) => a.viewing_order - b.viewing_order)
                    .map((subscription) => (
                        <div className="col-sm-4 col-lg-4">
                            <SubscriptionPackageItem
                                key={subscription.id}
                                subscription={subscription}
                                isActive={activeSubscriptionId === subscription.id}
                                showCheckoutCallback={showCheckoutCallback}
                            />
                        </div>
                    ))
            }
        </>
    )
}

export default SubscriptionPackageList

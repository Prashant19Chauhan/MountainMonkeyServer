export const smartRouteFinder = (routeType, step, StepRoutes) => {
    return {
        routeType: routeType,
        totalMinCost: step?.totalMinCost,
        totalMaxCost: step?.totalMaxCost,
        totalDuration: step?.totalDuration,
        distance: step?.totalDistance,
        modesUsed: step?.previousRoutesTrack.map((stepId) =>{
            const mode = StepRoutes.find((s) => s?.stepId === stepId);
            return mode?.travelDetails?.mode;
        }),
        steps: step?.previousRoutesTrack,
        stopCount: step?.totalStops,
        score: {
            costEfficiency: (step?.totalMinCost + step?.totalMaxCost) / 2,
            timeEfficiency: step?.totalDuration,
            convenience: step?.totalDistance
        },
        aiSummary: `You will reach your destination in ${step?.totalDuration} minutes at an estimated cost of $${(step?.totalMinCost + step?.totalMaxCost) / 2}. The total distance is ${step?.totalDistance} km.`
    }
}


export const findCheapestAndFastestAndShortestDistanceRoute = (StepRoutes) => {

    let avgCostTillNow
    let minDurationTillNow
    let minDistanceTillNow

    let cheapestRouteId
    let fastestRouteId
    let shortestDistanceId

    for(const step of StepRoutes){
        if(step.isDestinationReached){
            avgCostTillNow = (step?.totalMinCost + step?.totalMaxCost)/ 2;
            minDurationTillNow = step?.totalDuration;
            minDistanceTillNow = step?.totalDistance;

            cheapestRouteId = step?.stepId;
            fastestRouteId = step?.stepId;
            shortestDistanceId = step?.stepId;

            break;
        }
    }

    for(const step of StepRoutes){
        if(step?.isDestinationReached){
            if(((step?.totalMinCost + step?.totalMaxCost) / 2) < avgCostTillNow){
                avgCostTillNow = (step?.totalMinCost + step?.totalMaxCost)/ 2;
                cheapestRouteId = step?.stepId;
            }
            if(minDurationTillNow>step?.totalDuration){
                minDurationTillNow = step?.totalDuration;
                fastestRouteId = step?.stepId;
            }
            if(minDistanceTillNow>step?.totalDistance){
                minDistanceTillNow = step?.totalDistance;
                shortestDistanceId = step?.stepId;
            }
        }
    }
    return {
        cheapestRouteId,
        fastestRouteId,
        shortestDistanceId
    }
}

### HYDROLOGICAL PROCESSES MODELING USING GIS
 
 Keywords: hydrological modeling; HEC-RAS; flooding; hydrology; unmanned aerial vehicles; digital elevation model.
####  Goal of a research.
Periodic spring or summer floods and floodings on one of the largest rivers of Ukraine Dniester cause significant economic losses, causing social tension in the region. Therefore, the prevention of floods, warning the population about the danger of destructive consequences is part of the state policy.
Hydrological modeling using GIS allows to prevent the population and civil servants to possible losses caused by floods and flooding events, to assess the risk of flooding and reduce the risks of this cataclysm. The studies relate to the simulation of flooding at the site of the Dniester river between town Sambor and village Khatki in Lviv region.  The investigated area is characterized by a complex winding shape of the channel, its significant meandering, significant planned displacements, which were investigated on the basis of topographic maps and satellite images over the past 70 years.
#### Methodology and scope of a research. The method of investigation of flooded areas as a result of water rise to a certain level has been processed. It includes:
•	survey of the area with UAVs;
•	the implementation of geodetic and hydrological activities in the field of research;
•	creation of DEM based on survey results and analysis of its accuracy;
•	hydrological modeling using the HEC-RAS software package;
•	determination of flood areas.
In order to obtain a digital elevation model, which is the basis for hydrological modeling, shooting with a Trimble UX5 UAV using a Sony NEX-5R camera was performed. From calculations of accuracy of determination of coordinates of points of DEM it is established that the standard error for planned coordinates makes 6 cm; high-altitude coordinates depending on the basis of shooting and the underlying surface – 0,21 – 0,32 m. For construction of DEM the specialized software Pix4D was used.
The input data for hydrological modeling were the materials of the expedition, whose task was to determine the geodetic coordinates of the terrain points for the construction of the DEM in a given coordinate system, estimate the accuracy of the DEM and measure the depths of the channel in the modulated part of the river, which were used to describe the bottom relief. Information about the water flow rate is obtained on hydrographs.
In General, the hydrological information for operational calculations of the steady flow of water includes graphs or tables with the data dependencies of the water flow from the absolute elevation, the coefficients of the underlying surface roughness and the coefficient of the level of slope of the bed.
#### Highlight of results.
Data preparation for hydrological modeling in HEC-RAS was performed using ArcMap 10.1 GIS and HEC-GeoRAS utility. HEC-GeoRAS is a set of tools for processing geospatial data in the ArcGIS environment.
The software package HEC-RAS is based on a one-dimensional model, so the main way of calculation is based on the solution of the flow energy equation, in which energy losses due to the friction force, narrowing or expansion of the river bed are estimated. The 1-dimensional Saint-Venant equation in the form of the final calculation by the finite difference method is used to calculate the unstated flow. The equation is solved by a numerical method, the input data of which are the cross-sectional lines. To ensure the accuracy of the simulation, their interval should not exceed 100 meters. In our study, this parameter is 50 meters.
A feature of the construction of cross-section lines is that they must meet a number of requirements. Due to the complexity of the channel, this procedure is more complicated than the case of a straight channel.
The equation of continuity, energy and flow resistance is used for modeling in the software complex. The continuity equation is described by a constant and continuous period of time. The flow energy equation reflects the total energy of the flow can be defined at any point along the entire simulated riverbed as the total water pressure. The flow resistance equation is based on the manning equation, which contains data on the average roughness along the entire perimeter of the flow in the considered section of the channel.
hydrological modeling for three water flow rates was performed, which corresponds to the levels of elevation by 1, 2, 3 m.
#### Main conclusions. 
•	The DEM was created according to the results of removal from the UAV to the average quadratic error of 0.2 m.
•	The technique of hydrological modeling implemented on the part of the Dniester river with a complex configuration of the channel is processed.
•	Areas have been designated and area of flooding at different levels of rise of water

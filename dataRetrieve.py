#!/usr/bin/python3

import sys


file = open("./exfilledDataCleaned.txt", "r")

array = []

for line in file:
    array.append(line)

print(array)
print(len(array))


# sys.exit();

# Go through each exfilled line finding
for x in array:
    # First entry will be the exfilled chunk index
    # Second entry will the list of piece data
    splitter = x.split(' ')
    indexList = splitter[0]
    dataList = splitter[1]
    
    # Split our list of index'es into an array we can easily reference
    indexArray = indexList.split(',')

    # Same with our data pieces. The number of data pieces and index pieces
    # *should* match
    dataArray = dataList.split(',')

    numIndexes = len(indexArray)
    numDatas   = len(dataArray)


    # Sanity check that our exfilled data was read correctly. 
    if (numIndexes != numDatas):
        print("Number of chunks does not match the number of data pieces. Something is really wrong")
        sys.exit()


    # If we got here, we know our array sizes match between piece indexes and data pieces. 
    # We can loop through both arrays at the same time with a single counter safely. 
    # And they'll match up index to piece
    for index in range(numIndexes):
        pieceName = indexArray[index]

        # Let's start writing some files...

        # First we have to build our filename. Use the chunk piece as the filename
        filename = './data/' + pieceName + '.chunk'
        print("Filename is: " + filename)


        # Open the file in write mode
        f = open(filename, "w")

        # Write the data for the piece
        f.write(dataArray[index])
        f.close()




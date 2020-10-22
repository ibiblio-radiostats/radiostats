import React from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import IconButton from '@material-ui/core/IconButton';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';

export default function ArrowDropDownBtn({category, sortCategory, initSort}) {
    const [sort, setSort] = React.useState(initSort);

    const handleIconClick = (event) => {
        // Changing the sort type.
        sort === "desc" ? setSort("asc") : setSort("desc");

        // Calling parent function.
        sortCategory(category, sort);
    }

    return (
        <IconButton onClick={handleIconClick}>
            {(sort === "asc" && <ArrowDropUpIcon/>) || <ArrowDropDownIcon/> }
        </IconButton>
    );
}
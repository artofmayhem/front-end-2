import React, { useEffect, useState } from 'react';
import Class from './Class.js';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
import { gsap } from "gsap";
import { connect } from "react-redux";
import { getData, searchTerm, getFilteredClasses, allClasses }  from "../../state/actions/index.js";



/* REDUX NOTE:
STATE NEEDED:  allClasses, filteredClasses, searchTerm
STATE CHANGERS NEEDED:  setAllClasses, setFilteredClasses, setSearchTerm
INITIAL STATE:  initialClassesValues (which gets assigned to setAllClasses and setFilteredClasses) 

/* States for Classes.js & Search Functionality
const [ allClasses, setAllClasses ] = useState(initialClassesValues);
const [ filteredClasses, setFilteredClasses ] = useState(initialClassesValues);
const [ searchTerm, setSearchTerm ] = useState('');
*/

/*
PROPS (below)
allClasses, setAllClasses, filteredClasses, setFilteredClasses, setSearchTerm
*/

const Classes = (props) => {
    // console.log("props", props); // log props
    // console.log("props.filteredClasses", props.filteredClasses) // log filteredClasses
    // console.log("Classes: user from redux state", props.user) // log user

  // ----------- Helper Function ---------------------
    const getFilteredClassesHelper = (searchTerm) => {
        // edge case if searchTerm is "", reset filteredClasses to allClasses
        if (searchTerm === "") {
            props.myGetFilteredClasses(props.classes);
            return; // bail our of getFilteredClassesHelper because no searchTerm
        }

        console.log("getFilteredClassesHelper fires")

        // filter function over classes array
        const filteredClasses = props.classes.filter( indivClass => {
            // clean up search term, assign to searchText
            const searchText = searchTerm.toLowerCase().trim();
            const name = indivClass.class_name.toLowerCase();
            const type = indivClass.class_type.toLowerCase();
            const time = indivClass.start_time.toLowerCase();
            const intensity = indivClass.intensity.toLowerCase();
            const location = indivClass.location.toLowerCase();
            
            // check for match, create boolean
            const matchesName = name.includes(searchText); 
            const matchesType = type.includes(searchText);
            const matchesDate = indivClass.class_date.includes(searchText);
            const matchesTime = time.includes(searchText);
            const matchesDuration = indivClass.intensity.includes(searchText);
            const matchesIntensity = intensity.includes(searchText);
            const matchesLocation = location.includes(searchText);
            
            return matchesName || matchesType || matchesDate || matchesTime || matchesDuration || matchesIntensity || matchesLocation;
            
        }); // end of filter

        console.log("filteredClasses: ", filteredClasses);

        props.myGetFilteredClasses(filteredClasses);

    };

  // ----------- Helper Function ---------------------}
    const searchChangeHandler = (e) => {
        const enteredSearchTerm = e.target.value;
        props.mySearchTerm(enteredSearchTerm); // readable option
        // props.mySearchTerm({enteredSearchTerm: e.target.value}); // cleaner option
        getFilteredClassesHelper(enteredSearchTerm); // trigger filter Helper function
    };

  // -------------------- Side Effects -----------------
//   useEffect(() => {
//     axios.get('https://pt-fitness.herokuapp.com/classes')
//       .then(res => {
 
        // console.log("All Classes ", res.data);
        // console.log("Successful res back from Axios, res.data: ", res.data);

//         setAllClasses(res.data)
//         setFilteredClasses(res.data)

//       })
//       .catch(err => {
//         console.log("Error: ", err)
//         // history.push(`/error`)
//        alert("There was an error in loading classes.")
//        // debugger
//       })
//   }, [setAllClasses, setFilteredClasses]); // populates allClasses on browser reload

    useEffect(() => {
    gsap.to(".animation", {duration: 2, y: 30});
    }, []); // gsap animation to slide cards down slightly upon load

return (
    <>

    <div className='classes-background'>
        <div className='classes-content-container'>    

            <div className='d-flex flex-row flex-wrap'>          
                <h1>Classes</h1>        

                <SearchIcon className='search-icon' style={{ color: '444444', marginTop: '2vh'}} fontSize="large"/>

                <input
                placeholder="Search for classes"
                type="text"
                onChange={searchChangeHandler}
                style={{
                    width: '12vw',
                    height: '2rem',
                    marginTop: '2vh'
                }}
                />

            </div>
        
            <div className="classes-container d-flex flex-row flex-wrap justify-content-center class-box">

                <div className="animation d-flex flex-row flex-wrap justify-content-center ">
                {props.filteredClasses && 
                props.filteredClasses.map(indivClass => {
                    // console.log("indivClass: ", indivClass)
                    const classKey = Math.random().toString(16).slice(2);
                    return <Class key={classKey} indivClass={indivClass} />
                })
                }

                {/* {props.classes && 
                props.classes.map(indivClass => {
                    // console.log("indivClass: ", indivClass)
                    const classKey = Math.random().toString(16).slice(2);
                    return <Class key={classKey} indivClass={indivClass} />
                })
                } */}
                </div>

            </div>

        </div>
    </div>

    </>
    )
}

const mapStateToProps = (state) => {
    return {
        classes: state.classes,
        filteredClasses: state.filteredClasses,
        isLoading: state.isLoading,
        user: state.user,
        searchTerm: state.searchTerm,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getData: dispatch(getData()),
        allClasses: dispatch(allClasses()),

        myGetFilteredClasses: (filteredClasses) => dispatch(getFilteredClasses(filteredClasses)),
        mySearchTerm: (enteredSearchTerm) => dispatch(searchTerm(enteredSearchTerm))
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Classes);


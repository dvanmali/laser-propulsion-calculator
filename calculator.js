/**
 * This document uses JSDoc (http://usejsdoc.org) for documentation.
 */

// Units
var m = 1;
var km = 1e3 * m;
var au = 149597870700 * m;
var ly = 9.4607e15 * m;
var cm = 1e-2 * m;
var um = 1e-6 * m;
var nm = 1e-9 * m;

var kg = 1;
var g = 1e-3 * kg;

var W = 1;
var kW = 1e3 * W;
var MW = 1e6 * W;
var GW = 1e9 * W;

var J = 1;
var tons_TNT = 4.2e9 * J;

var s = 1;
var hr = 3600 * s;
var d = 86400 * s;
var yr = 365 * d;

// Constants
var c_speed_light = 299792458 * m / s;
var g_n = 9.80665 * m / Math.pow( s, 2 );
var h_planck = 6.626070040e-34 * J / s;

/**
 * Input variables
 *
 * @typedef {Object} Input
 * @property {String} label - User friendly name
 * @property {Number} unit - Display different SI units than those calculated
 * @property {Number} val - Default value initially, but becomes user-entered value
 * @property {Number} min_val - Lowest allowed value in the input
 * @property {Number} max_val - Maximum allowed value in the input
 * @property {Number} step_val - Interval to jump when using arrows on the HTML input
 */
var inputs = {
	m0_payload_mass:
	{
		label: 'Payload',
		unit:
		{
			kg: kg
		},
		val: 0.001
	},
	auto_sail:
	{
		label: 'Use Optimal Sail Size',
		checked: true
	},
	D_sail_size:
	{
		label: 'Sail Size',
		unit:
		{
			'm': m
		}
	},
	h_sail_thickness:
	{
		label: 'Sail Thickness',
		unit:
		{
			'&mu;m': um
		},
		val: 1
	},
	rho_sail_density:
	{
		label: 'Sail Density',
		unit:
		{
			'g/cm<sup>3</sup>': ( g / Math.pow( cm, 3 ) ) // Grams per centimeter cubed
		},
		val: 1
	},
	d_array_size:
	{
		label: 'Laser Array Size',
		unit:
		{
			'm': m
		},
		val: 10000
	},
	P_optical:
	{
		label: 'Total Optical Power',
		unit:
		{
			'GW': GW
		},
		val: 100
	},
	epsilon_sub_beam_beam_eff:
	{
		label: 'Beam Efficiency (0 - 1)',
		val: 1,
		attributes:
		{
			max: 1
		}
	},
	lambda_wavelength:
	{
		label: 'Wavelength',
		unit:
		{
			'nm': nm
		},
		val: 1060,
		attributes:
		{
			min: 1
		}
	},
	epsilon_sub_elec_photon_to_electrical_eff:
	{
		label: 'Electrical Efficiency (0 - 1)',
		val: 1,
		attributes:
		{
			max: 1
		}
	},
	energy_cost:
	{
		label: 'Electrical Energy Cost',
		unit:
		{
			'$/kW-hr': ( 1 / ( kW * hr ) )
		},
		val: 0.1
	},
	energy_storage_cost:
	{
		label: 'Energy Storage Cost',
		unit:
		{
			'$/W-hr': ( 1 / ( W * hr ) )
		},
		val: 0.1
	},
	Laser_comm_spacecraft_power_peak:
	{
		label: 'Peak Laser Comm Power',
		unit:
		{
			'W': W
		},
		val: 1
	},
	Photons_per_bit_for_communication:
	{
		label: 'Photons Per Bit for Communication',
		unit:
		{
			'ph/bit': 1
		},
		val: 1
	},
	lambda_laser_comm_wavelength:
	{
		label: 'Laser Comm Wavelength',
		unit:
		{
			'nm': nm
		},
		val: 600
	},
	Laser_comm_beam_efficiency:
	{
		label: 'Laser Comm Beam Efficiency (0 - 1)',
		val: 1
	},
	Laser_comm_spacecraft_optics_size:
	{
		label: 'Spacecraft Laser Comm Optical Size',
		unit:
		{
			'm': m
		},
		val: 1
	},
	L_target:
	{
		label: 'Target Distance',
		unit:
		{
			'ly': ly
		},
		val: 4.37
	}
};

/**
 * Output variables
 *
 * @typedef {Object} Output
 * @property {String} label - User friendly name
 * @property {Number} unit - Display different SI units than those calculated
 * @property {Number} val - Calculated value
 * @property {Function} update() - Updates val
 */
var outputs = {
	m_sail:
	{
		label: 'Sail Mass',
		unit:
		{
			g: g
		},
		update()
		{
			this.val = Math.pow( inputs.D_sail_size.val, 2 ) * inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
		}
	},
	m_total_mass:
	{
		label: 'Total Mass',
		unit:
		{
			g: g
		},
		update()
		{
			this.val = inputs.m0_payload_mass.val + outputs.m_sail.val;
		}
	},
	sail_areal:
	{
		label: 'Areal Density',
		unit:
		{
			'g/m<sup>2</sup>': ( g / Math.pow( m, 2 ) )
		},
		update()
		{
			this.val = inputs.h_sail_thickness.val * inputs.rho_sail_density.val;
		}
	},
	P0_laser_power_in_main_beam:
	{
		label: 'Laser Power in Main Beam',
		unit:
		{
			'GW': GW
		},
		update()
		{
			this.val = inputs.epsilon_sub_beam_beam_eff.val * inputs.P_optical.val;
		}
	},
	flux_on_sail:
	{
		label: 'Flux on Sail',
		unit:
		{
			'GW/m<sup>2</sup>': ( GW / Math.pow( m, 2 ) )
		},
		update()
		{
			this.val = outputs.P0_laser_power_in_main_beam.val / Math.pow( inputs.D_sail_size.val, 2 );
		}
	},
	a_acceleration:
	{
		label: 'Peak Acceleration',
		unit:
		{
			'm/s<sup>2</sup>': 1,
			'g<sub>n</sub>': g_n
		},
		update()
		{
			this.val = 2 * outputs.P0_laser_power_in_main_beam.val / ( outputs.m_total_mass.val * c_speed_light );
		}
	},
	L0_distance_to_spot_size_equals_sail_size:
	{
		label: 'L<sub>0</sub>',
		unit:
		{
			au: au,
			km: km
		},
		update()
		{
			this.val = inputs.d_array_size.val * inputs.D_sail_size.val / ( 2 * inputs.lambda_wavelength.val );
		}
	},
	t0_time_to_L0:
	{
		label: 'Time to L<sub>0</sub>',
		unit:
		{
			d: d,
			s: s
		},
		update()
		{
			this.val = Math.sqrt( c_speed_light * inputs.d_array_size.val * inputs.D_sail_size.val * outputs.m_total_mass.val /
				( 2 * outputs.P0_laser_power_in_main_beam.val * inputs.lambda_wavelength.val ) );
		}
	},
	v_0_speed_to_L0:
	{
		label: 'Speed at L<sub>0</sub>',
		unit:
		{
			'km/s': ( km / s ),
			'% c': ( c_speed_light / 100 )
		},
		update()
		{
			this.val = Math.sqrt( 2 * outputs.P0_laser_power_in_main_beam.val * inputs.d_array_size.val * inputs.D_sail_size.val /
				( c_speed_light * inputs.lambda_wavelength.val * outputs.m_total_mass.val ) );
		}
	},
	l0_ke:
	{
		label: 'Kinetic Energy at L<sub>0</sub>',
		unit:
		{
			'GW*hr': ( GW * hr ),
			J: J
		},
		update()
		{
			this.val = 0.5 * outputs.m_total_mass.val * Math.pow( outputs.v_0_speed_to_L0.val, 2 );
		}
	},
	E_gamma_photon_energy_in_main_beam_to_time_t0:
	{
		label: 'Laser Energy in Main Beam at L<sub>0</sub>',
		unit:
		{
			'GW*hr': ( GW * hr ),
			J: J
		},
		update()
		{
			this.val = outputs.P0_laser_power_in_main_beam.val * outputs.t0_time_to_L0.val;
		}
	},
	E_elec_total_electrical_energy_used_to_t0:
	{
		label: 'Electrical Energy at L<sub>0</sub>',
		unit:
		{
			'GW*hr': ( GW * hr ),
			J: J
		},
		update()
		{
			this.val = inputs.P_optical.val * outputs.t0_time_to_L0.val / inputs.epsilon_sub_elec_photon_to_electrical_eff.val;
		}
	},
	launch_efficiency_at_L0:
	{
		label: 'Launch Efficiency at L<sub>0</sub> (KE / Electrical Energy)',
		unit:
		{
			'%': 1 / 100
		},
		update()
		{
			this.val = outputs.l0_ke.val / outputs.E_elec_total_electrical_energy_used_to_t0.val;
		}
	},
	energy_cost_per_launch:
	{
		label: 'Electrical Energy Cost at L<sub>0</sub>',
		unit:
		{
			'$': 1
		},
		update()
		{
			this.val = outputs.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_cost.val;
		}
	},
	energy_storage_cost_per_launch:
	{
		label: 'Energy Storage Cost at L<sub>0</sub>',
		unit:
		{
			'$': 1
		},
		update()
		{
			this.val = outputs.E_elec_total_electrical_energy_used_to_t0.val * inputs.energy_storage_cost.val;
		}
	},
	v_infinity_speed_with_continued_illumination:
	{
		label: 'Limiting Speed',
		unit:
		{
			'km/s': ( km / s ),
			'% c': ( c_speed_light / 100 )
		},
		update()
		{
			this.val = Math.sqrt( 2 ) * outputs.v_0_speed_to_L0.val;
		}
	},
	time_to_target_at_limiting_speed:
	{
		label: 'Time to Target at Limiting Speed',
		unit:
		{
			'yr': yr
		},
		update()
		{
			this.val = inputs.L_target.val / outputs.v_infinity_speed_with_continued_illumination.val;
		}
	},
	Laser_comm_flux_at_earth:
	{
		label: 'Laser Comm Flux at Earth',
		unit:
		{
			's<sup>-1</sup>m<sup>-2</sup>': ( 1 / ( s * Math.pow( m, 2 ) ) )
		},
		update()
		{
			this.val = inputs.Laser_comm_beam_efficiency.val * inputs.Laser_comm_spacecraft_power_peak.val /
				( h_planck * c_speed_light / ( inputs.lambda_laser_comm_wavelength.val ) ) /
				Math.pow( inputs.L_target.val * 2 * inputs.lambda_laser_comm_wavelength.val / inputs.Laser_comm_spacecraft_optics_size.val, 2 );
		}
	},
	Laser_comm_photometric_magnitude:
	{
		label: 'Equivalent Photometric Magnitude m<sub>v</sub>',
		unit:
		{
			'': 1 // Unitless
		},
		update()
		{
			this.val = -2.5 * Math.log( outputs.Laser_comm_flux_at_earth.val / 3e10 ) / Math.log( 10 );
		}
	},
	Laser_comm_rate_at_earth:
	{
		label: 'Laser Comm Rate Received in Array',
		unit:
		{
			'ph/s': ( 1 / s )
		},
		update()
		{
			this.val = outputs.Laser_comm_flux_at_earth.val * Math.pow( inputs.d_array_size.val, 2 );
		}
	},
	Laser_comm_bit_rate_received_in_array:
	{
		label: 'Laser Comm Bit Rate Received in Array',
		unit:
		{
			'bits/s': 1
		},
		update()
		{
			this.val = outputs.Laser_comm_rate_at_earth.val / inputs.Photons_per_bit_for_communication.val;
		}
	},
	Laser_comm_received_wavelength_at_L0:
	{
		label: 'Laser Comm Wavelength at Speed at L0',
		unit:
		{
			'nm': nm
		},
		update()
		{
			var beta_0 = outputs.v_0_speed_to_L0.val / c_speed_light;

			this.val = inputs.lambda_laser_comm_wavelength.val * Math.pow( ( 1 + beta_0 ) / ( 1 - beta_0 ), 1 / 2 );
		}
	},
	Laser_comm_received_wavelength_at_limiting_speed:
	{
		label: 'Laser Comm Wavelength at Limiting Speed',
		unit:
		{
			'nm': nm
		},
		update()
		{
			var beta_infinity = outputs.v_infinity_speed_with_continued_illumination.val / c_speed_light;

			this.val = inputs.lambda_laser_comm_wavelength.val * Math.pow( ( 1 + beta_infinity ) / ( 1 - beta_infinity ), 1 / 2 );
		}
	}
};

/** Determine if variable is a number
 *
 * @param {*} n - Variable to check
 * @return {Boolean}
 */
function isNumeric( n )
{
	return !isNaN( parseFloat( n ) ) && isFinite( n );
}

/** Determine if variable has a value
 *
 * @param {*} v - Variable to check
 * @return {Boolean}
 */
function isDefined( v )
{

	return typeof v !== 'undefined';
}

/** Initializes the HTML input and output tables
 * Note this is an immediately invoked function and will run immediately
 */
( function init()
{
	/** Create a two column row
	 * 
	 * @param {Array} cells - Array of cells/ columns to populate the row
	 * @return {DOMElement} Table row/ tr DOM Element
	 */
	function createTableRow( cells )
	{
		var row = document.createElement( 'tr' );

		for ( var i = 0; i < cells.length; i++ )
		{
			var cell = document.createElement( 'td' );

			// Create a cell with multiple children
			if ( Array.isArray( cells[ i ] ) )
			{
				for ( var j = 0; j < cells[ i ].length; j++ )
				{
					cell.appendChild( cells[ i ][ j ] );
				}
			}
			else
			{
				// Create a cell with one child
				cell.appendChild( cells[ i ] );
			}

			row.appendChild( cell );
		}

		return row;
	}

	// Populate the input form/ table with inputs
	var inputs_element = document.getElementById( 'inputs' );
	for ( var id in inputs )
	{
		var input = inputs[ id ];
		var label = document.createElement( 'label' );
		var element = input.element = document.createElement( 'input' );

		label.innerHTML = input.label;
		element.setAttribute( 'id', id );

		// Checkbox input
		if ( typeof input.checked !== 'undefined' )
		{
			element.setAttribute( 'type', 'checkbox' );
			element.setAttribute( 'checked', input.checked );
			element.addEventListener( 'click', update, false );
		}
		else
		{
			element.setAttribute( 'type', 'number' );
			element.setAttribute( 'value', input.val );
			element.addEventListener( 'input', update, false );

			// Convert default values to their correct units
			var i = 0;
			for ( var unit in input.unit )
			{
				if ( i > 0 )
				{
					throw "Only one input unit allowed";
				}

				label.innerHTML += ' <label class="unit">(' + unit + ')</label>';
				input.val *= input.unit[ unit ];

				// Only allow one unit for inputs
				i++;
			}
		}

		// Add attributes to the DOMElement (such as max, min, and step for inputs)
		for ( var attribute in input.attributes )
		{
			element.setAttribute( attribute, input.attributes[ attribute ] );
		}

		// Create a table row for the input element and its label
		var table_row = createTableRow( [ label, element ] );
		inputs_element.appendChild( table_row );
	}

	// Populate the output form/ table with outputs
	var outputs_element = document.getElementById( 'outputs' );
	for ( var id in outputs )
	{
		var output = outputs[ id ];
		var label = document.createElement( 'label' );
		var rowCells = [ label ];
		var element = output.element = {};

		label.innerHTML = output.label;

		// Create object to store values for each unit
		outputs[ id ].unitVal = {};

		// Create a table cell with the output and its units
		for ( var unit in output.unit )
		{
			var unitVal = document.createElement( 'div' );
			var unitLabel = document.createElement( 'label' );
			unitLabel.className = 'unit';
			unitLabel.innerHTML = ' ' + unit;

			rowCells.push( [ unitVal, unitLabel ] );
			element[ unit ] = unitVal;
		}

		var table_row = createTableRow( rowCells );
		outputs_element.appendChild( table_row );
	}

	// Calculate and display outputs according to the default input values
	optimize();
	calculate();
	render();

	document.getElementById( 'download_csv' ).addEventListener( 'click', downloadCSV, false );
} )();

/** Record changes to an HTML input
 *
 * @param {DOMElement} input_element - HTML input to retrieve value from
 * @return {Boolean} Whether input is valid or not
 */
function load( input_element )
{
	var input = inputs[ input_element.getAttribute( 'id' ) ];
	input.val = input.rawVal = input_element.value;

	// Numerical input
	if ( isNumeric( input.val ) )
	{
		if ( isDefined( input.attributes ) )
		{
			// Value is below allowed range
			if ( isDefined( input.attributes.min ) && input.val <= input.attributes.min )
			{
				return;
			}

			// Value is above allowed range
			if ( isDefined( input.attributes.min ) && input.val > input.attributes.max )
			{
				return;
			}
		}

		// Update function to modify the entered value
		if ( isDefined( input.update ) )
		{
			input.update();
		}

		// Convert to standard units
		for ( var unit in input.unit )
		{
			input.val *= input.unit[ unit ];
		}

		return true;
	}

	// Checkbox input
	if ( isDefined( input.checked ) )
	{
		input.checked = input_element.checked;

		return true;
	}
}

/** Optimize the size of the sail
 */
function optimize()
{
	inputs.D_sail_size.element.disabled = inputs.auto_sail.checked;

	if ( !inputs.auto_sail.checked )
	{
		return;
	}

	// Calculate sail size for sail mass = m0_payload_mass mass
	inputs.D_sail_size.element.value = inputs.D_sail_size.val =
		Math.sqrt( inputs.m0_payload_mass.val / ( inputs.rho_sail_density.val * inputs.h_sail_thickness.val ) );
}

/** Calculate the outputs
 */
function calculate()
{
	for ( var id in outputs )
	{
		// Calculate standard output value
		outputs[ id ].update();

		// Convert output's value to non-standard units
		for ( var unit in outputs[ id ].unit )
		{
			outputs[ id ].unitVal[ unit ] = ( outputs[ id ].val / outputs[ id ].unit[ unit ] ).toPrecision( 3 );
		}
	}
}

/** Render the outputs
 */
function render()
{
	for ( var id in outputs )
	{
		for ( var unit in outputs[ id ].unitVal )
		{
			outputs[ id ].element[ unit ].innerHTML = outputs[ id ].unitVal[ unit ] + ' ';
		}
	}
}

/** Event handler when inputs are changed
 * Re-calculate the outputs based on the new inputs
 *
 * @param {Event} e
 */
function update( e )
{
	if ( !load( e.target ) )
	{
		return;
	}

	optimize();
	calculate();
	render();
}

/*
 * CSV download functionality
 */

function downloadCSV()
{
	exportToCsv( "test.csv", createCSV() );
}

function exportToCsv( filename, rows )
{
	var processRow = function ( row )
	{
		var finalVal = '';
		for ( var j = 0; j < row.length; j++ )
		{
			var innerValue = typeof row[ j ] === 'undefined' ? '' : row[ j ].toString();
			if ( row[ j ] instanceof Date )
			{
				innerValue = row[ j ].toLocaleString();
			};
			var result = innerValue.replace( /"/g, '""' );
			if ( result.search( /("|,|\n)/g ) >= 0 )
				result = '"' + result + '"';
			if ( j > 0 )
				finalVal += ',';
			finalVal += result;
		}
		return finalVal + '\n';
	};

	var csvFile = '';
	for ( var i = 0; i < rows.length; i++ )
	{
		csvFile += processRow( rows[ i ] );
	}

	var blob = new Blob( [ csvFile ],
	{
		type: 'text/csv;charset=utf-8;'
	} );
	if ( navigator.msSaveBlob )
	{ // IE 10+
		navigator.msSaveBlob( blob, filename );
	}
	else
	{
		var link = document.createElement( "a" );
		if ( link.download !== undefined )
		{ // feature detection
			// Browsers that support HTML5 download attribute
			var url = URL.createObjectURL( blob );
			link.setAttribute( "href", url );
			link.setAttribute( "download", filename );
			link.style.visibility = 'hidden';
			document.body.appendChild( link );
			link.click();
			document.body.removeChild( link );
		}
	}
}

function createCSV()
{
	var lineArray = [
		[ "Inputs", "Value", "Unit", "Outputs", "Value", "Unit" ]
	];

	var inputsArray = Object.getOwnPropertyNames( inputs );
	var outputsArray = Object.getOwnPropertyNames( outputs );

	for ( var i = 0; i < Math.max( inputsArray.length, outputsArray.length ); i++ )
	{
		var input = inputs[ inputsArray[ i ] ];
		var output = outputs[ outputsArray[ i ] ];

		var line = [];

		if ( isDefined( input ) )
		{
			line.push( htmlToText( input.label ) );

			var j = 0;
			for ( var unit in input.unit )
			{
				line.push( input.val / input.unit[ unit ] );
				line.push( htmlToText( unit ) );

				j++;
			}

			// For unitless inputs
			if ( j != 1 )
			{
				line.push( "" );
			}
		}
		else
		{
			// More outputs than inputs so add empty input line
			line = line.concat( [ "", "", "" ] );
		}

		if ( isDefined( output ) )
		{
			line.push( htmlToText( output.label ) );

			for ( var unit in output.unitVal )
			{
				line.push( output.unitVal[ unit ] );
				line.push( htmlToText( unit ) );
			}

			lineArray.push( line );
		}
	}

	return lineArray;
}

/*
 * Convert unit in HTML format to text
 */
function htmlToText( unitHTML )
{
	if ( !isDefined( unitHTML ) )
	{
		return unitHTML;
	}

	unitHTML = String( unitHTML ).replace( /&mu;/g, "u" );
	unitHTML = String( unitHTML ).replace( /<sup>/g, "^" );
	unitHTML = String( unitHTML ).replace( /<sub>/g, "_" );

	unitHTML = String( unitHTML ).replace( /<\/sup>/g, "" );
	unitHTML = String( unitHTML ).replace( /<\/sub>/g, "" );

	return unitHTML;
}
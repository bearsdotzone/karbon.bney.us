using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class TileComputeShaderProperties 
{
	public const string PositionBufferName 			= "posBuffer";
	public const string NeighboursBufferName 		= "neighboursBuffer";
	public const string PrePropertiesBufferName 	= "prePropertiesBuffer";
	public const string PostPropertiesBufferName	= "postPropertiesBuffer";
	public const string DeltaTimeBufferName 		= "deltaTimeBuffer";
	public const string MainKernel					= "CSMain";
}

public struct AtmosphericsProperties {
	public float molesOxygen;
	public float molesNitrogen;
	public float molesCarbonDioxide;
	public float molesNitrousOxide; 
	public float molesPlasma;
	public float molesBZ;
	public float molesFreon;
	public float pressure;
	public float temperature;
	public bool hasAtmosphere;
}

public class AtmosphericsSystem : MonoBehaviour 
{
	public ComputeShader AtmosphericsComputeShader;
	public StationSpawner Spawner;

	private ComputeBuffer positionBuffer;
	private ComputeBuffer prePropertiesBuffer;
	private ComputeBuffer postPropertiesBuffer;
	private ComputeBuffer neighboursBuffer;
	private ComputeBuffer deltaTimeBuffer;

	private const int gridUnitSideX       = 64;
	private const int gridUnitSideY       = 64;
	private const int numThreadsPerGroupX = 4;
	private const int numThreadsPerGroupY = 4;

	private int GridResX;
	private int GridResY;
	private int TileCount;
	private int MainKernel;

	private void Start ()
	{
		Initialise ();
	}

	void Update ()
	{
		HandleIO ();
		Dispatch ();
		UpdateTileGases ();
	}

	private void OnDisable()
	{
		ReleaseBuffers ();
	}
		
	public float GetWorldGridSideLengthX()
	{
		return GridResX * 2.5f;
	}

	public float GetWorldGridSideLengthY()
	{
		return GridResY * 2.5f;
	}

	public void Initialise ()
	{
		GridResX = gridUnitSideX * numThreadsPerGroupX;
		GridResY = gridUnitSideY * numThreadsPerGroupY;
		TileCount = GridResX * GridResY;
		CreateBuffers ();
		Vector3[] positions = new Vector3[TileCount];
		positionBuffer.GetData (positions);
		Spawner.SpawnTiles (positions);
	}

	public void CreateBuffers ()
	{
		positionBuffer 			= new ComputeBuffer (TileCount, sizeof (float) * 3);
		prePropertiesBuffer 	= new ComputeBuffer (TileCount, sizeof (float));
		postPropertiesBuffer 	= new ComputeBuffer (TileCount, sizeof (float));
		neighboursBuffer 		= new ComputeBuffer (TileCount, sizeof(float) * 8);
		deltaTimeBuffer 		= new ComputeBuffer (1, sizeof(float));

		ResetBuffers ();

		MainKernel = AtmosphericsComputeShader.FindKernel (TileComputeShaderProperties.MainKernel);
	}

	public void ResetBuffers ()
	{
		Vector3[] positions 	= new Vector3[TileCount];
		Vector3[] velocities 	= new Vector3[TileCount];
		Vector2[] neighbors 	= new Vector2[TileCount * 4];

		for (int i = 0; i < TileCount; i++) {
			float x = ((i % GridResX - GridResX / 2.0f) / GridResX) * GetWorldGridSideLengthX();
			float y = ((i / GridResX - GridResY / 2.0f) / GridResY) * GetWorldGridSideLengthY();

			positions [i] = new Vector3 (x, y, 0.0f);
		}

		positionBuffer.SetData (positions);
	}

	public void ReleaseBuffers ()
	{
		if (positionBuffer != null)
			positionBuffer.Release ();
		if (prePropertiesBuffer != null)
			prePropertiesBuffer.Release ();
		if (postPropertiesBuffer != null)
			postPropertiesBuffer.Release ();
		if (neighboursBuffer != null)
			neighboursBuffer.Release ();
		if (deltaTimeBuffer != null)
			deltaTimeBuffer.Release ();
	}

	private void HandleIO ()
	{

	}

	public int[] GetNeighbours (int index)
	{
		int[] neighbours = new int[4] {	index + GridResX, index + 1, index - GridResX, index - 1};
		return neighbours;
	}

	public Vector2[] GetNeighbourIndexFlagPairs (int index)
	{
		int[] neighbours = GetNeighbours (index);
		Vector2[] neighbourFlagPairs = new Vector2[4];
		for (int i = 0; i < 4; ++i) {
			int idx = neighbours [i];
			float flag = 0.0f;

		}

		return neighbourFlagPairs;
	}

	void SetPositionBuffers ()
	{
		AtmosphericsComputeShader.SetBuffer (MainKernel, TileComputeShaderProperties.DeltaTimeBufferName, deltaTimeBuffer);
		AtmosphericsComputeShader.SetBuffer (MainKernel, TileComputeShaderProperties.PositionBufferName, positionBuffer);
	}

	void Dispatch ()
	{
		SetPositionBuffers();
		AtmosphericsComputeShader.Dispatch (MainKernel, gridUnitSideX, gridUnitSideY, 1);
	}

	void UpdateTileGases ()
	{
		float[,] postProperties = new float[TileCount,9];
		postPropertiesBuffer.GetData (postProperties);
		Debug.Log (
			postProperties [0, 0] + " " +
			postProperties [0, 1] + " " + 
			postProperties [0, 2] + " " + 
			postProperties [0, 3] + " " + 
			postProperties [0, 4] + " " + 
			postProperties [0, 5] + " " + 
			postProperties [0, 6] + " " + 
			postProperties [0, 7] + " " + 
			postProperties [0, 8]
		);
	}
}